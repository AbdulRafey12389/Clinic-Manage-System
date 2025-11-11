import Room from "../../models/room.js";

export const getAvailableRooms = async (req, res) => {
  try {
    const availableRooms = await Room.find({ status: "Available" })
      .select("roomNumber type capacity status notes")
      .sort({ roomNumber: 1 });

    if (!availableRooms.length) {
      return res.status(200).json({
        success: true,
        message: "No rooms available at the moment",
        availableRooms: [],
      });
    }

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
