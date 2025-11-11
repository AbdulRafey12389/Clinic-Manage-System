import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bed,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  LoaderCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  addRoom,
  deleteRoom,
  editRoom,
  getAllRooms,
} from '@/api/admin/adminManageRoom';
import { toast } from 'sonner';

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    roomNumber: '',
    type: '',
    capacity: '',
    status: 'Available',
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllRooms();
        setRooms(response.rooms);
      } catch (error) {
        console.log('Error fetching rooms', error);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!form.roomNumber || !form.type || !form.capacity) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        const updatedRooms = rooms.map((r) =>
          r._id === editId ? { ...r, ...form } : r,
        );
        setRooms(updatedRooms);
        await editRoom(editId, form);
        toast.success('Room updated successfully');
        setIsEditing(false);
        setEditId(null);
      } else {
        const response = await addRoom(form);
        if (response.success === true) {
          setRooms((prev) => [...prev, response.room]);
          toast.success('Room created successfully');
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error('Error while saving room');
      console.error(error);
    } finally {
      setForm({ roomNumber: '', type: '', capacity: '', status: 'Available' });
      setLoading(false);
    }
  };

  const handleEdit = (room) => {
    setIsEditing(true);
    setEditId(room._id);
    setForm({
      roomNumber: room.roomNumber,
      type: room.type,
      capacity: room.capacity,
      status: room.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this room?')) {
        setRooms((prev) => prev.filter((r) => r._id !== id));
        toast.success('Room deleted successfully');
        await deleteRoom(id);
      }
    } catch (error) {
      toast.error('Error deleting room');
      console.error(error);
    }
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-2xl font-semibold flex items-center gap-2'>
          <Bed className='text-emerald-400' /> Manage Rooms
        </h1>
        <p className='text-sm text-gray-400'>
          Admin can add or update Clinic rooms
        </p>
      </motion.div>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl space-y-5'>
        <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
          <PlusCircle
            className='text-emerald-400'
            size={20}
          />
          {isEditing ? 'Update Room' : 'Add New Room'}
        </h2>

        <div className='grid md:grid-cols-4 gap-4'>
          <Input
            placeholder='Room Number'
            value={form.roomNumber}
            onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            className='bg-[#0b0f0e] border-emerald-500/10 text-white'
          />

          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className='bg-[#0b0f0e] border border-emerald-500/10 text-white rounded-lg p-2'
          >
            <option value=''>Select Room Type</option>
            <option value='ICU'>ICU</option>
            <option value='Private'>Private</option>
            <option value='General'>General</option>
            <option value='OPD'>OPD</option>
          </select>

          <Input
            placeholder='Capacity'
            type='number'
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className='bg-[#0b0f0e] border-emerald-500/10 text-white'
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className='bg-[#0b0f0e] border border-emerald-500/10 text-white rounded-lg p-2'
          >
            <option value='Available'>Available</option>
            <option value='Occupied'>Occupied</option>
            <option value='Maintenance'>Maintenance</option>
          </select>
        </div>

        <Button
          onClick={handleSubmit}
          className='bg-emerald-500 hover:bg-emerald-600 text-white'
          disabled={loading}
        >
          {loading ? (
            <LoaderCircle className='white h-5 w-5 animate-spin' />
          ) : (
            `${isEditing ? 'Update Room' : 'Add Room'}`
          )}
        </Button>
      </Card>

      <div className='flex items-center justify-between'>
        <div className='relative w-full md:w-1/3'>
          <Search
            className='absolute left-3 top-2.5 text-gray-400'
            size={18}
          />
          <Input
            placeholder='Search room by number or type...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='pl-10 bg-[#101614] border-emerald-500/10 text-white'
          />
        </div>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {filteredRooms.map((room) => (
          <Card
            key={room._id}
            className='p-5 bg-[#101614] border border-emerald-500/10 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]'
          >
            <div className='flex items-center justify-between mb-3'>
              <h2 className='text-xl font-semibold text-white'>
                Room {room.roomNumber}
              </h2>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEdit(room)}
                  className='text-emerald-400 hover:text-emerald-300'
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className='text-red-400 hover:text-red-300'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className='text-sm text-gray-400 mb-1'>Type: {room.type}</p>
            <p className='text-sm text-gray-400 mb-1'>
              Capacity: {room.capacity}
            </p>
            <p
              className={`text-sm font-semibold ${
                room.status === 'Available'
                  ? 'text-emerald-400'
                  : room.status === 'Occupied'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            >
              Status: {room.status}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ManageRooms;
