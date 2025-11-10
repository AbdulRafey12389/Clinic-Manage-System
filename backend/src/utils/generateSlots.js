import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export const generateTimeSlots = (from, to, durationMinutes) => {
  const slots = [];

  // Convert times using proper AM/PM parsing
  let start = dayjs(from, "hh:mm A");
  const end = dayjs(to, "hh:mm A");

  // Safety check: agar parse na ho to console karo
  if (!start.isValid() || !end.isValid()) {
    console.log("⛔ Invalid time format:", from, to);
    return [];
  }

  while (start.isBefore(end)) {
    const slotStart = start.format("hh:mm A");
    const slotEnd = start.add(durationMinutes, "minute").format("hh:mm A");

    // ensure slotEnd doesn’t exceed ‘to’
    if (dayjs(slotEnd, "hh:mm A").isAfter(end)) break;

    slots.push(`${slotStart} - ${slotEnd}`);
    start = start.add(durationMinutes, "minute");
  }

  return slots;
};
