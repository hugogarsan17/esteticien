// app/api/book/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";

const TIMEZONE = "Europe/Madrid";
const SLOT_DURATION_MINUTES = 60;

export async function POST(req: Request) {
  const body = await req.json();
  const { date, time, name, email, notes } = body;

  if (!date || !time || !name) {
    return NextResponse.json(
      { error: "Faltan campos: date, time, name" },
      { status: 400 }
    );
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    const [hours, minutes] = time.split(":").map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(start.getTime() + SLOT_DURATION_MINUTES * 60000);

    const event = {
      summary: `Cita Lucia Esdo - ${name}`,
      description: notes || "",
      start: {
        dateTime: start.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: TIMEZONE,
      },
      attendees: email
        ? [
            {
              email,
            },
          ]
        : [],
    };

    await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la reserva" },
      { status: 500 }
    );
  }
}
