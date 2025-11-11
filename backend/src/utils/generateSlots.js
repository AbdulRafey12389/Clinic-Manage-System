import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export const generateTimeSlots = (from, to, durationMinutes) => {
  const slots = [];

  let start = dayjs(from, "hh:mm A");
  const end = dayjs(to, "hh:mm A");

  if (!start.isValid() || !end.isValid()) {
    console.log("⛔ Invalid time format:", from, to);
    return [];
  }

  while (start.isBefore(end)) {
    const slotStart = start.format("hh:mm A");
    const slotEnd = start.add(durationMinutes, "minute").format("hh:mm A");

    if (dayjs(slotEnd, "hh:mm A").isAfter(end)) break;

    slots.push(`${slotStart} - ${slotEnd}`);
    start = start.add(durationMinutes, "minute");
  }

  return slots;
};
