import Doctor from "../../models/doctor.js";
import Appointment from "../../models/appointment.js";
import { generateTimeSlots } from "../../utils/generateSlots.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

dayjs.extend(customParseFormat);

export const getAvailableDoctors = async (req, res) => {
  try {
    const currentDate = dayjs().format("YYYY-MM-DD");
    const currentDay = dayjs().format("dddd").toLowerCase();
    const now = dayjs();

    const allDoctors = await Doctor.find({ status: "active" })
      .populate({
        path: "_id",
        select: "name email",
      })
      .lean();

    const doctorsWorkingToday = allDoctors.filter((doc) => {
      if (!doc.workingDays || !Array.isArray(doc.workingDays)) return false;
      return doc.workingDays.some(
        (day) => day.toLowerCase().trim() === currentDay
      );
    });

    if (!doctorsWorkingToday.length) {
      return res.status(200).json({
        success: true,
        message: `No doctors available today (${currentDay})`,
        data: [],
      });
    }

    const bookedAppointments = await Appointment.find({
      date: currentDate,
      status: { $in: ["Pending", "Approved"] },
    }).select("doctor timeSlot");

    const bookedMap = {};
    bookedAppointments.forEach((a) => {
      const dId = a.doctor.toString();
      if (!bookedMap[dId]) bookedMap[dId] = [];
      const normalizedSlot = a.timeSlot.trim();
      bookedMap[dId].push(normalizedSlot);
    });

    const availableDoctors = [];

    for (const doc of doctorsWorkingToday) {
      if (!doc._id) continue;

      const todaySchedule = doc.schedule?.find(
        (s) => s?.day?.toLowerCase().trim() === currentDay
      );

      if (!todaySchedule || !todaySchedule.from || !todaySchedule.to) {
        continue;
      }

      const allSlots = generateTimeSlots(
        todaySchedule.from,
        todaySchedule.to,
        todaySchedule.slotDurationMinutes || 30
      );

      if (!allSlots.length) continue;

      const doctorId = doc._id._id?.toString() || doc._id.toString();
      const bookedSlots = bookedMap[doctorId] || [];

      const availableSlots = allSlots.filter((slot) => {
        const normalizedSlot = slot.trim();
        const [startTimeStr] = normalizedSlot.split(" - ").map((s) => s.trim());
        
        const slotDateTime = dayjs(`${currentDate} ${startTimeStr}`, "YYYY-MM-DD hh:mm A");
        
        if (!slotDateTime.isValid()) {
          return false;
        }

        const isPast = slotDateTime.isBefore(now, "minute");
        
        const isBooked = bookedSlots.some(
          (booked) => booked.trim() === normalizedSlot
        );

        return !isPast && !isBooked;
      });

      if (availableSlots.length === 0) continue;

      availableDoctors.push({
        doctorId: doctorId,
        name: doc._id.name || "",
        email: doc._id.email || "",
        specialization: doc.specialization || "",
        experience: doc.experience || "",
        roomIds: todaySchedule.roomIds || [],
        availableSlots: availableSlots,
        todayTiming: `${todaySchedule.from} - ${todaySchedule.to}`,
        slotDuration: todaySchedule.slotDurationMinutes || 30,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Today's available doctors fetched successfully",
      data: availableDoctors,
    });
  } catch (err) {
    console.error("getAvailableDoctors Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
