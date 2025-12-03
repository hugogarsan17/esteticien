// app/api/availability/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";
import { toZonedTime, fromZonedTime, formatInTimeZone } from "date-fns-tz";
import { addMinutes, differenceInMinutes } from "date-fns";

const TIMEZONE = "Europe/Madrid";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date"); // YYYY-MM-DD
  const duration = parseInt(searchParams.get("duration") || "60", 10);
  const grid = parseInt(searchParams.get("grid") || "15", 10);
  const bufferBefore = parseInt(searchParams.get("bufferBefore") || "0", 10);
  const bufferAfter = parseInt(searchParams.get("bufferAfter") || "0", 10);
  const WORK_START_HOUR = parseInt(searchParams.get("workStart") || "09", 10);
  const WORK_END_HOUR = parseInt(searchParams.get("workEnd") || "17", 10);

  if (!date) {
    return NextResponse.json({ error: "Falta el parámetro 'date' (YYYY-MM-DD)" }, { status: 400 });
  }
  if (isNaN(duration) || duration <= 0) {
    return NextResponse.json({ error: "Parámetro 'duration' inválido" }, { status: 400 });
  }
  if (isNaN(grid) || grid <= 0) {
    return NextResponse.json({ error: "Parámetro 'grid' inválido" }, { status: 400 });
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    const dayStartLocalString = `${date}T${String(WORK_START_HOUR).padStart(2, "0")}:00:00`;
    const dayEndLocalString = `${date}T${String(WORK_END_HOUR).padStart(2, "0")}:00:00`;

    // Convertir esas horas locales a UTC for FreeBusy query (fromZonedTime convierte hora zonal a UTC)
    const dayStartUtc = fromZonedTime(dayStartLocalString, TIMEZONE); // Date en UTC equivalente
    const dayEndUtc = fromZonedTime(dayEndLocalString, TIMEZONE);

    // FreeBusy
    const fbRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStartUtc.toISOString(),
        timeMax: dayEndUtc.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busyRaw = fbRes.data.calendars?.[calendarId]?.busy || [];
    const busySlots: { start: Date; end: Date }[] = busyRaw.map((b: any) => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }));

    // Trabajamos la generación de candidatos en "zona local" usando toZonedTime para obtener Date con campos locales
    const workStartZoned = toZonedTime(dayStartUtc, TIMEZONE); // Date que representa la hora local
    const workEndZoned = toZonedTime(dayEndUtc, TIMEZONE);

    const available: { label: string; iso: string }[] = [];

    let cursor = new Date(workStartZoned);
    // Alinear cursor a la grid (redondear hacia abajo)
    const mins = cursor.getMinutes();
    const rem = mins % grid;
    if (rem !== 0) {
      cursor = addMinutes(cursor, -rem);
    }

    while (differenceInMinutes(workEndZoned, cursor) >= duration + bufferBefore + bufferAfter) {
      const candidateStartLocal = new Date(cursor);
      const candidateStartWithBufferLocal = addMinutes(candidateStartLocal, -bufferBefore);
      const candidateEndLocal = addMinutes(candidateStartLocal, duration);
      const candidateEndWithBufferLocal = addMinutes(candidateEndLocal, bufferAfter);

      // Convertir los extremos con buffer a UTC para la comprobación con busySlots
      const candidateStartWithBufferUtc = fromZonedTime(
        candidateStartWithBufferLocal.toISOString().slice(0, 19),
        TIMEZONE
      );
      const candidateEndWithBufferUtc = fromZonedTime(
        candidateEndWithBufferLocal.toISOString().slice(0, 19),
        TIMEZONE
      );

      const overlaps = busySlots.some((ev) => {
        return !(ev.end <= candidateStartWithBufferUtc || ev.start >= candidateEndWithBufferUtc);
      });

      if (!overlaps) {
        // label legible en local y ISO de inicio real (sin buffers) en UTC
        const label = formatInTimeZone(candidateStartLocal, TIMEZONE, "HH:mm");
        const isoStart = fromZonedTime(candidateStartLocal.toISOString().slice(0, 19), TIMEZONE).toISOString();
        available.push({ label, iso: isoStart });
      }

      cursor = addMinutes(cursor, grid);
    }

    return NextResponse.json({ slots: available });
  } catch (err) {
    console.error("availability error:", err);
    return NextResponse.json({ error: "Error obteniendo disponibilidad" }, { status: 500 });
  }
}
