import Appointment from "../../models/appointment.js";
import Room from "../../models/room.js";
import mongoose from "mongoose";

export const bookAppoinment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const patient = req.user._id;

  try {
    const {
      doctor,
      doctorName,
      date,
      timeSlot,
      room,
      reason,
    } = req.body;

    console.log(req.body);

    if (!patient || !doctor || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: patient, doctor, date, or timeSlot",
      });
    }

    const existingAppointment = await Appointment.findOne({
      doctor,
      date,
      timeSlot,
      status: { $in: ["Pending", "Approved"] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked for the selected doctor",
      });
    }

    const newAppointment = await Appointment.create(
      [
        {
          patient,
          doctor,
          doctorName,
          date,
          timeSlot,
          room,
          reason,
          status: "Pending",
        },
      ],
      { session }
    );

    if (room) {
      const updatedRoom = await Room.findByIdAndUpdate(
        room,
        { status: "Occupied" },
        { new: true, session }
      );

      if (!updatedRoom) {
        throw new Error("Selected room not found");
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
      error: error.message,
    });
  }
};
