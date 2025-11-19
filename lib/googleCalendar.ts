// lib/googleCalendar.ts
import { google } from "googleapis";

export async function getCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  // Convertir "\n" en saltos de línea reales
  if (privateKey) {
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  if (!clientEmail) {
    throw new Error("GOOGLE_CLIENT_EMAIL no está definido");
  }

  if (!privateKey) {
    throw new Error("GOOGLE_PRIVATE_KEY no está definido o está vacío");
  }

  if (!calendarId) {
    throw new Error("GOOGLE_CALENDAR_ID no está definido");
  }

  // ⭐ FORMA ACTUALIZADA (Google API v8+)
  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  // Autenticar
  await auth.authorize();

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  return { calendar, calendarId };
}
