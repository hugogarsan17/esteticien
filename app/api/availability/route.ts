// app/api/availability/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";
import { formatInTimeZone } from "date-fns-tz";
import { addMinutes, differenceInMinutes } from "date-fns";

const TIMEZONE = "Europe/Madrid";
const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") || "60", 10);
  const grid = parseInt(searchParams.get("grid") || "15", 10);

  if (!date) {
    return NextResponse.json({ error: "Falta 'date'" }, { status: 400 });
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    const workStartLocal = new Date(`${date}T${WORK_START_HOUR.toString().padStart(2,"0")}:00:00`);
    const workEndLocal = new Date(`${date}T${WORK_END_HOUR.toString().padStart(2,"0")}:00:00`);

    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: workStartLocal.toISOString(),
        timeMax: workEndLocal.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busySlots = (fb.data.calendars?.[calendarId]?.busy || []).map((b: any) => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }));

    const available: { label: string; iso: string }[] = [];
    let cursor = new Date(workStartLocal);

    const rem = cursor.getMinutes() % grid;
    if (rem !== 0) cursor = addMinutes(cursor, grid - rem);

    while (differenceInMinutes(workEndLocal, cursor) >= duration) {
      const startLocal = new Date(cursor);
      const endLocal = addMinutes(startLocal, duration);

      const overlaps = busySlots.some(
        ev => !(ev.end <= startLocal || ev.start >= endLocal)
      );

      if (!overlaps) {
        available.push({
          label: formatInTimeZone(startLocal, TIMEZONE, "HH:mm"),
          iso: startLocal.toISOString(),
        });
      }

      cursor = addMinutes(cursor, grid);
    }

    return NextResponse.json({ slots: available });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error obteniendo disponibilidad" }, { status: 500 });
  }
}
