// controllers/patient/getAvailableDoctors.controller.js
import Doctor from "../../models/doctor.js";
import Appointment from "../../models/appointment.js";
import { generateTimeSlots } from "../../utils/generateSlots.js";
import dayjs from "dayjs";

export const getAvailableDoctors = async (req, res) => {
  try {
    // 1️⃣ Current day and date
    const currentDate = dayjs().format("YYYY-MM-DD");
    const currentDay = dayjs().format("dddd").toLowerCase(); // e.g. "monday"
    const currentTime = dayjs(); // now

    // 2️⃣ Get all doctors working today
    const doctors = await Doctor.find({ workingDays: currentDay })
      .populate({
        path: "_id",
        select: "name email role",
      })
      .lean();

    if (!doctors.length) {
      return res.status(200).json({
        success: true,
        message: `No doctors available today (${currentDay})`,
        data: [],
      });
    }

    // 3️⃣ Get booked appointments for today
    const bookedAppointments = await Appointment.find({
      date: currentDate,
      status: { $in: ["Pending", "Approved"] },
    }).select("doctor timeSlot");

    // doctorId → bookedSlots[]
    const bookedMap = {};
    bookedAppointments.forEach((a) => {
      const dId = a.doctor.toString();
      if (!bookedMap[dId]) bookedMap[dId] = [];
      bookedMap[dId].push(a.timeSlot);
    });

    // 4️⃣ Build today's available doctors with filtered slots
    const availableDoctors = doctors
      .map((doc) => {
        const todaySchedule = doc.schedule.find(
          (s) => s.day.toLowerCase() === currentDay
        );
        if (!todaySchedule) return null;

        // 5️⃣ Generate all slots
        const allSlots = generateTimeSlots(
          todaySchedule.from,
          todaySchedule.to,
          todaySchedule.slotDurationMinutes
        );

        // 6️⃣ Filter out booked & past slots
        const booked = bookedMap[doc._id._id?.toString()] || [];
        const availableSlots = allSlots.filter((slot) => {
          const [startTime] = slot.split(" - ");
          const slotStart = dayjs(startTime, "hh:mm A");

          const isPast = slotStart.isBefore(currentTime);
          const isBooked = booked.includes(slot);

          return !isPast && !isBooked;
        });

        // 7️⃣ Return doctor info + available slots
        return {
          doctorId: doc._id._id,
          name: doc._id.name,
          email: doc._id.email,
          specialization: doc.specialization,
          experience: doc.experience,
          roomIds: todaySchedule.roomIds || [],
          availableSlots,
          todayTiming: `${todaySchedule.from} - ${todaySchedule.to}`,
          slotDuration: todaySchedule.slotDurationMinutes,
        };
      })
      .filter(Boolean); // remove null

    // ✅ Final Response
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
