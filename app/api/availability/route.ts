// app/api/availability/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";

const TIMEZONE = "Europe/Madrid";

// Configura aquí tu horario general de trabajo
const WORK_START_HOUR = 10; // 10:00
const WORK_END_HOUR = 18;   // 18:00
const SLOT_DURATION_MINUTES = 60; // citas de 60 min

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date"); // formato YYYY-MM-DD

  if (!date) {
    return NextResponse.json(
      { error: "Falta el parámetro 'date' (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    // Construimos el rango del día en tu zona horaria
    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);

    const res = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStart.toISOString(),
        timeMax: dayEnd.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busySlots =
      res.data.calendars?.[calendarId]?.busy?.map((b) => ({
        start: new Date(b.start!),
        end: new Date(b.end!),
      })) || [];

    // Generar todos los huecos de trabajo del día
    const availableSlots: string[] = [];

    const slotStart = new Date(date);
    slotStart.setHours(WORK_START_HOUR, 0, 0, 0);

    const slotEndLimit = new Date(date);
    slotEndLimit.setHours(WORK_END_HOUR, 0, 0, 0);

    while (slotStart < slotEndLimit) {
      const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MINUTES * 60000);

      const overlapsBusy = busySlots.some((busy) => {
        return slotStart < busy.end && slotEnd > busy.start;
      });

      if (!overlapsBusy) {
        // Enviamos la hora como string (ej: "10:00", "11:00")
        const hours = slotStart.getHours().toString().padStart(2, "0");
        const minutes = slotStart.getMinutes().toString().padStart(2, "0");
        availableSlots.push(`${hours}:${minutes}`);
      }

      slotStart.setMinutes(slotStart.getMinutes() + SLOT_DURATION_MINUTES);
    }

    return NextResponse.json({ slots: availableSlots });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error obteniendo disponibilidad" },
      { status: 500 }
    );
  }
}
