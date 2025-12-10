// app/api/availability/route.ts
import { NextResponse } from "next/server";
import { getCalendarClient } from "@/lib/googleCalendar";
import { formatInTimeZone } from "date-fns-tz";
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
    return NextResponse.json({ error: "Falta 'date' (YYYY-MM-DD)" }, { status: 400 });
  }

  try {
    const { calendar, calendarId } = await getCalendarClient();

    //
    // 1) CREAR HORAS LOCALES EXACTAS (SIN DST BUGS)
    //
    const workStartLocal = new Date(`${date}T${String(WORK_START_HOUR).padStart(2, "0")}:00:00`);
    const workEndLocal   = new Date(`${date}T${String(WORK_END_HOUR).padStart(2, "0")}:00:00`);

    //
    // 2) PARA FREEBUSY → convertir local Date a UTC
    //
    const dayStartUtc = new Date(workStartLocal.getTime());
    const dayEndUtc   = new Date(workEndLocal.getTime());

    //
    // 3) Obtener eventos ocupados
    //
    const fbRes = await calendar.freebusy.query({
      requestBody: {
        timeMin: dayStartUtc.toISOString(),
        timeMax: dayEndUtc.toISOString(),
        timeZone: TIMEZONE,
        items: [{ id: calendarId }],
      },
    });

    const busySlots = (fbRes.data.calendars?.[calendarId]?.busy || []).map((b: any) => ({
      start: new Date(b.start),
      end: new Date(b.end),
    }));

    //
    // 4) Generar slots en HORA LOCAL NATIVA
    //
    const available: { label: string; iso: string }[] = [];

    let cursor = new Date(workStartLocal);

    // Ajustar cursor al grid
    const rem = cursor.getMinutes() % grid;
    if (rem !== 0) cursor = addMinutes(cursor, -rem);

    while (differenceInMinutes(workEndLocal, cursor) >= duration + bufferBefore + bufferAfter) {
      const startLocal = new Date(cursor);
      const startLocalBuf = addMinutes(startLocal, -bufferBefore);
      const endLocal = addMinutes(startLocal, duration);
      const endLocalBuf = addMinutes(endLocal, bufferAfter);

      // Convertir local → UTC para comparar
      const startUtcBuf = new Date(startLocalBuf.getTime());
      const endUtcBuf   = new Date(endLocalBuf.getTime());

      const overlaps = busySlots.some((ev) => !(ev.end <= startUtcBuf || ev.start >= endUtcBuf));

      if (!overlaps) {
        const label = formatInTimeZone(startLocal, TIMEZONE, "HH:mm");
        const iso = new Date(startLocal.getTime()).toISOString(); // UTC
        available.push({ label, iso });
      }

      cursor = addMinutes(cursor, grid);
    }

    return NextResponse.json({ slots: available });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error obteniendo disponibilidad" }, { status: 500 });
  }
}
