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

    // 1) Construir strings locales (hora "en pared")
    const dayStartLocalString = `${date}T${String(WORK_START_HOUR).padStart(2, "0")}:00:00`;
    const dayEndLocalString = `${date}T${String(WORK_END_HOUR).padStart(2, "0")}:00:00`;

    // 2) Convertir esas horas LOCALES a UTC para la consulta FreeBusy
    // En date-fns-tz v1 usamos fromZonedTime(localString, zone) para obtener el Date UTC correcto
    const dayStartUtc = fromZonedTime(dayStartLocalString, TIMEZONE);
    const dayEndUtc = fromZonedTime(dayEndLocalString, TIMEZONE);

    // 3) Llamada FreeBusy (usamos timeMin/timeMax en UTC ISO)
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
      start: new Date(b.start), // b.start es ISO en UTC
      end: new Date(b.end),
    }));

    // 4) Para iterar en "hora de pared" convertimos UTC -> zoned (hora local con campos correctos)
    const workStartLocal = toZonedTime(dayStartUtc, TIMEZONE); // representa 09:00 en la zona
    const workEndLocal = toZonedTime(dayEndUtc, TIMEZONE);     // representa 17:00 en la zona

    const available: { label: string; iso: string }[] = [];

    // 5) Cursor inicial (hora local)
    let cursor = new Date(workStartLocal);

    // Alinear cursor hacia abajo al múltiplo de grid (por ejemplo, 09:07 -> 09:00 con grid=15)
    const rem = cursor.getMinutes() % grid;
    if (rem !== 0) {
      cursor = addMinutes(cursor, -rem);
    }

    // Helper para formatear a "YYYY-MM-DDTHH:mm:ss" en la zona
    const fmtLocalIso = (d: Date) => formatInTimeZone(d, TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");

    // 6) Iterar en hora local y comparar (conversión a UTC para comparar con busySlots)
    while (differenceInMinutes(workEndLocal, cursor) >= duration + bufferBefore + bufferAfter) {
      const startLocal = new Date(cursor);
      const startLocalWithBuffer = addMinutes(startLocal, -bufferBefore);
      const endLocal = addMinutes(startLocal, duration);
      const endLocalWithBuffer = addMinutes(endLocal, bufferAfter);

      // Convertir extremos con buffer a UTC (fromZonedTime espera un local string y devuelve Date UTC)
      const startUtcWithBuffer = fromZonedTime(fmtLocalIso(startLocalWithBuffer), TIMEZONE);
      const endUtcWithBuffer = fromZonedTime(fmtLocalIso(endLocalWithBuffer), TIMEZONE);

      const overlaps = busySlots.some((ev) => {
        return !(ev.end <= startUtcWithBuffer || ev.start >= endUtcWithBuffer);
      });

      if (!overlaps) {
        const label = formatInTimeZone(startLocal, TIMEZONE, "HH:mm");
        // iso de inicio real en UTC (útil para crear evento): convertimos el local a UTC y hacemos toISOString()
        const isoStartUtc = fromZonedTime(fmtLocalIso(startLocal), TIMEZONE).toISOString();
        available.push({ label, iso: isoStartUtc });
      }

      cursor = addMinutes(cursor, grid);
    }

    return NextResponse.json({ slots: available });
  } catch (err) {
    console.error("availability error:", err);
    return NextResponse.json({ error: "Error obteniendo disponibilidad" }, { status: 500 });
  }
}
