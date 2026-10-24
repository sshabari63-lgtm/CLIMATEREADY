import { DailyForecastItem, ChecklistItem } from '../types';

export function generateICS(
  locationName: string,
  dailyForecast: DailyForecastItem[],
  checklist: ChecklistItem[]
): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const formatICSDate = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const nowStr = formatICSDate(new Date());

  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ClimateReady//Resilience Hub Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:ClimateReady 7-Day Preparedness Schedule',
    'X-WR-TIMEZONE:Asia/Kolkata',
  ];

  dailyForecast.forEach((day, index) => {
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + index);
    eventDate.setHours(9, 0, 0, 0); // 9:00 AM

    const endDate = new Date(eventDate);
    endDate.setHours(10, 0, 0, 0);

    const startFormatted = formatICSDate(eventDate);
    const endFormatted = formatICSDate(endDate);

    // Pick task recommendation based on weather
    let recommendedTask = 'Daily hydration check and emergency radio test.';
    if (day.maxTemp >= 38) {
      recommendedTask = 'Heat Alert: Store extra potable water and prep ORS packets before midday peak heat.';
    } else if (day.precipitationSum >= 20) {
      recommendedTask = 'Rain Alert: Inspect rooftop drainage, clear gutters, and elevate lower ground electronics.';
    } else {
      const pendingTask = checklist.find((c) => !c.isCompleted);
      if (pendingTask) {
        recommendedTask = `Priority Action: ${pendingTask.title}`;
      }
    }

    const summary = `ClimateReady Day ${index + 1}: ${recommendedTask}`;
    const description = `Preparedness Day ${index + 1} for ${locationName}.\\nForecast: Max Temp ${day.maxTemp}°C (Heat Index: ${day.apparentTempMax}°C), Rainfall: ${day.precipitationSum} mm.\\n\\nDisclaimer: ClimateReady reminders are advisory personal recommendations, not official disaster warnings.`;

    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:cr-${index}-${Date.now()}@climateready.org`);
    icsLines.push(`DTSTAMP:${nowStr}`);
    icsLines.push(`DTSTART:${startFormatted}`);
    icsLines.push(`DTEND:${endFormatted}`);
    icsLines.push(`SUMMARY:${summary}`);
    icsLines.push(`DESCRIPTION:${description}`);
    icsLines.push(`LOCATION:${locationName}`);
    icsLines.push('STATUS:CONFIRMED');
    icsLines.push('BEGIN:VALARM');
    icsLines.push('TRIGGER:-PT30M');
    icsLines.push('ACTION:DISPLAY');
    icsLines.push(`DESCRIPTION:ClimateReady Preparedness Reminder: ${summary}`);
    icsLines.push('END:VALARM');
    icsLines.push('END:VEVENT');
  });

  icsLines.push('END:VCALENDAR');
  return icsLines.join('\r\n');
}

export function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
