// app/api/book/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";

const TIMEZONE = "Europe/Madrid";
const DEFAULT_DURATION_MINUTES = 60;

function isValidEmail(email: any) {
  if (!email || typeof email !== "string") return false;
  const s = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(s);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      startIso,
      date,
      time,
      duration,
      name,
      email,
      notes,
      serviceId,
      serviceTitle,
    } = body;

    if (!startIso && !(date && time)) {
      return NextResponse.json(
        { error: "Faltan campos: envía startIso (recomendado) o date + time (HH:MM)" },
        { status: 400 }
      );
    }

    const dur = Number(duration ?? DEFAULT_DURATION_MINUTES);
    if (!Number.isFinite(dur) || dur <= 0) {
      return NextResponse.json({ error: "duration inválido" }, { status: 400 });
    }

    // construir start Date de forma segura teniendo en cuenta la zona
    let start: Date;
    if (startIso) {
      start = new Date(startIso);
    } else {
      // esperamos date = "YYYY-MM-DD" y time = "HH:MM"
      const [hhStr, mmStr] = String(time).split(":");
      const hh = Number(hhStr ?? NaN);
      const mm = Number(mmStr ?? NaN);
      if (!Number.isFinite(hh) || !Number.isFinite(mm)) {
        return NextResponse.json({ error: "time debe tener formato HH:MM" }, { status: 400 });
      }

      // crear la cadena local y convertirla a UTC según la zona especificada
      // Ej: "2025-12-10T09:30:00"
start = new Date(`${date}T${String(hh).padStart(2,"0")}:${String(mm).padStart(2,"0")}:00`);
      // zonedTimeToUtc devuelve un Date en UTC que corresponde a esa hora local en TIMEZONE
    }

    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: "start inválido" }, { status: 400 });
    }

    const end = new Date(start.getTime() + dur * 60000);

    const { calendar, calendarId } = await getCalendarClient();

    // re-check freebusy
    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busy = fb.data.calendars?.[calendarId]?.busy || [];
    if (busy.length > 0) {
      return NextResponse.json({ error: "Slot ya ocupado", busy }, { status: 409 });
    }

    // construir event
    const summary = serviceTitle
      ? `${serviceTitle} - ${name ?? "Reserva"}`
      : name
      ? `Reserva - ${name}`
      : "Reserva";

    let description = "";
    if (name) description += `Nombre: ${name}\n`;
    if (email) description += `Email: ${email}\n`;
    if (serviceId) description += `Servicio ID: ${serviceId}\n`;
    if (notes) description += `Notas: ${notes}\n`;

    const eventBody: any = {
      summary,
      description,
      start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
      end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
    };

    const emailIsValid = isValidEmail(email);
    if (emailIsValid) {
      eventBody.attendees = [{ email: email!.trim() }];
    }

    try {
      const insertRes = await calendar.events.insert({
        calendarId,
        requestBody: eventBody,
        sendUpdates: emailIsValid ? "all" : "none",
      });

      return NextResponse.json({ ok: true, event: insertRes.data });
    } catch (insertErr: any) {
      console.error("Google insert error (with attendees):", insertErr?.response?.data || insertErr);

      if (emailIsValid) {
        try {
          const fallbackBody = { ...eventBody };
          delete fallbackBody.attendees;

          const fallbackRes = await calendar.events.insert({
            calendarId,
            requestBody: fallbackBody,
            sendUpdates: "none",
          });

          return NextResponse.json({
            ok: true,
            event: fallbackRes.data,
            warning: "No se pudo enviar la invitación al email proporcionado; evento creado sin invitado.",
          });
        } catch (fallbackErr: any) {
          console.error("Google insert fallback error:", fallbackErr?.response?.data || fallbackErr);
          const msg = fallbackErr?.response?.data?.error?.message || fallbackErr?.message || "Error al crear evento (fallback)";
          return NextResponse.json({ error: msg }, { status: 500 });
        }
      }

      const msg = insertErr?.response?.data?.error?.message || insertErr?.message || "Error al crear evento";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  } catch (err: any) {
    console.error("POST /api/book unexpected error:", err?.response?.data || err);
    const msg = err?.response?.data?.error?.message || err?.message || "Error interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
