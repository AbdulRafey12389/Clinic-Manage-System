import Room from "../../models/room.js";

// ===================== CREATE ROOM =====================
export const createRoom = async (req, res) => {
  try {
    const { roomNumber, type, capacity, status, notes } = req.body;

    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom)
      return res
        .status(400)
        .json({ success: false, message: "Room number already exists" });

    const newRoom = await Room.create({
      roomNumber,
      type,
      capacity,
      status,
      notes,
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("Create Room Error:", error);
    res.status(500).json({ success: false, message: "Failed to create room" });
  }
};

// ===================== GET ALL ROOMS =====================
export const getAllRooms = async (req, res) => {
  try {
    const { type, status } = req.query;

    // filters (optional)
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const rooms = await Room.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: rooms.length,
      rooms,
    });
  } catch (error) {
    console.error("Get Rooms Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch rooms" });
  }
};

// ===================== UPDATE ROOM =====================
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedRoom)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Update Room Error:", error);
    res.status(500).json({ success: false, message: "Failed to update room" });
  }
};

// ===================== DELETE ROOM =====================
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndDelete(id);
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    res
      .status(200)
      .json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error("Delete Room Error:", error);
    res.status(500).json({ success: false, message: "Failed to delete room" });
  }
};
