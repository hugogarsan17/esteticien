// app/api/book/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";

const TIMEZONE = "Europe/Madrid";
const SLOT_DURATION_MINUTES = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, name, email, notes } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Faltan campos: date y time son obligatorios" },
        { status: 400 }
      );
    }

    const { calendar, calendarId } = await getCalendarClient();

    const [hours, minutes] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

    const summary = name
      ? `Cita Lucia Esdo - ${name}`
      : "Cita Lucia Esdo";

    // Construimos una descripción que incluya email y notas
    let description = "";
    if (name) description += `Nombre: ${name}\n`;
    if (email) description += `Email: ${email}\n`;
    if (notes) description += `Notas: ${notes}\n`;

    const event = {
      summary,
      description,
      start: {
        dateTime: start.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: TIMEZONE,
      },
      // 👇 OJO: NADA de attendees aquí
      // attendees: email ? [{ email }] : [],
    };

    const insertRes = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log("Evento creado:", insertRes.data.id);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Error al crear la reserva en Google Calendar:");
    console.error(error?.response?.data || error);
    return NextResponse.json(
      { error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}
