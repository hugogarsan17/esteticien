// app/api/book/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";

const DEFAULT_DURATION_MINUTES = 60;

function isValidEmail(email?: string) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { startIso, service, name, email, notes } = body;

    if (!startIso || !service) {
      return NextResponse.json({ error: "Faltan datos de reserva" }, { status: 400 });
    }

    const start = new Date(startIso);
    if (Number.isNaN(start.getTime())) {
      return NextResponse.json({ error: "startIso inválido" }, { status: 400 });
    }

    const duration = Number(service.duration ?? DEFAULT_DURATION_MINUTES);
    const end = new Date(start.getTime() + duration * 60000);

    const { calendar, calendarId } = await getCalendarClient();

    // Re-check disponibilidad
    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        items: [{ id: calendarId }],
      },
    });

    if ((fb.data.calendars?.[calendarId]?.busy ?? []).length > 0) {
      return NextResponse.json({ error: "Horario no disponible" }, { status: 409 });
    }

    const summary = `${service.title} — ${name || "Reserva web"}`;

    const description = [
      name && `Nombre: ${name}`,
      email && `Email: ${email}`,
      `Categoría: ${service.category}`,
      `Subcategoría: ${service.subcategory}`,
      `Precio: ${service.price}€`,
      notes && `Notas: ${notes}`,
    ]
      .filter(Boolean)
      .join("\n");

    const eventBody: any = {
      summary,
      description,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    };

    const emailOk = isValidEmail(email);
    if (emailOk) eventBody.attendees = [{ email }];

    const res = await calendar.events.insert({
      calendarId,
      requestBody: eventBody,
      sendUpdates: emailOk ? "all" : "none",
    });

    return NextResponse.json({ ok: true, eventId: res.data.id });
  } catch (err: any) {
    console.error("POST /api/book error:", err);
    return NextResponse.json({ error: "Error al crear la reserva" }, { status: 500 });
  }
}
