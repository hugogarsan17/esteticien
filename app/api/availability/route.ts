// app/api/availability/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";
import { formatInTimeZone } from "date-fns-tz";
import { addMinutes, differenceInMinutes } from "date-fns";

const TIMEZONE = "Europe/Madrid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");
  const duration = parseInt(searchParams.get("duration") || "60", 10);
  const grid = parseInt(searchParams.get("grid") || "15", 10);

  const WORK_START_HOUR = 9;
  const WORK_END_HOUR = 17;

  if (!date) {
    return NextResponse.json({ error: "Falta 'date'" }, { status: 400 });
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    //
    // 1) Horario local EXACTO sin conversiones peligrosas
    //
    const workStartLocal = new Date(`${date}T09:00:00`);
    const workEndLocal = new Date(`${date}T17:00:00`);

    //
    // 2) Para FreeBusy → pasar directo a UTC (JS lo hace bien)
    //
    const dayStartUtc = new Date(workStartLocal.getTime());
    const dayEndUtc = new Date(workEndLocal.getTime());

    //
    // 3) FreeBusy
    //
    const fb = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStartUtc.toISOString(),
        timeMax: dayEndUtc.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busySlots = (fb.data.calendars?.[calendarId]?.busy || []).map((b: any) => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }));

    //
    // 4) Generar slots locales NATIVOS sin tocar UTC
    //
    const available = [];
    let cursor = new Date(workStartLocal);

    const rem = cursor.getMinutes() % grid;
    if (rem !== 0) cursor = addMinutes(cursor, -rem);

    while (differenceInMinutes(workEndLocal, cursor) >= duration) {
      const startLocal = new Date(cursor);
      const endLocal = addMinutes(startLocal, duration);

      const startUtc = new Date(startLocal.getTime());
      const endUtc = new Date(endLocal.getTime());

      const overlaps = busySlots.some(ev => !(ev.end <= startUtc || ev.start >= endUtc));

      if (!overlaps) {
        available.push({
          label: formatInTimeZone(startLocal, TIMEZONE, "HH:mm"),
          iso: startUtc.toISOString(),
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
