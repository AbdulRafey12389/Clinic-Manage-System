import Room from "../../models/room.js";

export const getAvailableRooms = async (req, res) => {
  try {
    // Find only rooms that are currently available
    const availableRooms = await Room.find({ status: "Available" })
      .select("roomNumber type capacity status notes")
      .sort({ roomNumber: 1 });

    // If no available rooms found
    if (!availableRooms.length) {
      return res.status(200).json({
        success: true,
        message: "No rooms available at the moment",
        availableRooms: [],
      });
    }

    // Return available rooms
    res.status(200).json({
      success: true,
      count: availableRooms.length,
      availableRooms,
    });
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching rooms",
      error: error.message,
    });
  }
};
