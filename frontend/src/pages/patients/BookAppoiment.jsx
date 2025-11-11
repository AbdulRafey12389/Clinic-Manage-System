import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  Stethoscope,
  MessageSquare,
  Building,
  LoaderCircle,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  bookAppoitment,
  getAvailableDoctors,
  getAvailableRoom,
} from '@/api/pateint';
import { toast } from 'sonner';

export default function BookAppointment() {
  const location = useLocation();
  const preselectedDoctor = location.state?.doctor || null;

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [doctorId, setDoctorId] = useState(preselectedDoctor?.doctorId || '');
  const [timeSlot, setTimeSlot] = useState('');
  const [room, setRoom] = useState('');
  const [reason, setReason] = useState('');

  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorName, setDoctorname] = useState(preselectedDoctor?.name || '');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await getAvailableDoctors();
        const resRoom = await getAvailableRoom();

        setAvailableRooms(resRoom.availableRooms);

        const list = res.data || [];
        setDoctors(list);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    })();
  }, [preselectedDoctor]);

  useEffect(() => {
    if (doctorId) {
      const doc = doctors.find((d) => d.doctorId === doctorId);

      setAvailableSlots(doc?.availableSlots || []);
    }
  }, [doctorId, doctors]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!doctorId || !timeSlot) {
      alert('Please select doctor and time slot!');
      return;
    }

    const data = {
      doctor: doctorId,
      doctorName,
      date,
      timeSlot,
      room,
      reason,
    };

    console.log(doctorName);

    try {
      setLoading(true);
      const res = await bookAppoitment(data);
      if (res.success == true) {
        navigate('/patient/my-appointments');
      } else {
        toast.error(res.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDoctorChange = (e) => {
    const doctorId = e.target.value;
    const selected = doctors.find((doc) => doc.doctorId === doctorId);

    setDoctorId(doctorId);
    setAvailableSlots(selected?.availableSlots || []);
    setDoctorname(selected?.name);
  };

  return (
    <div className='space-y-6'>
      <motion.h1
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='text-2xl font-semibold text-white'
      >
        Book Appointment
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className='p-6 rounded-2xl bg-[#101614] border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'>
          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-1 md:grid-cols-2 gap-5'
          >
            <div>
              <label className='text-sm text-gray-400 flex items-center gap-2'>
                <Stethoscope
                  size={16}
                  className='text-emerald-400'
                />
                Select Doctor
              </label>
              <select
                value={doctorId}
                onChange={(e) => handleDoctorChange(e)}
                className='mt-2 w-full rounded-xl p-3 bg-[#0b0f0e]/90 border border-emerald-500/10 text-gray-300 focus:outline-none'
              >
                <option value=''>Select Doctor</option>
                {doctors.map((doc) => {
                  return (
                    <option
                      key={doc.doctorId}
                      value={doc.doctorId}
                    >
                      {doc.name} ({doc.specialization})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className='text-sm text-gray-400 flex items-center gap-2'>
                <CalendarDays
                  size={16}
                  className='text-emerald-400'
                />
                Select Date
              </label>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='mt-2 w-full rounded-xl p-3 bg-[#0b0f0e]/90 border border-emerald-500/10 text-gray-300 focus:outline-none cursor-pointer'
              />
            </div>

            <div>
              <label className='text-sm text-gray-400 flex items-center gap-2'>
                <Clock
                  size={16}
                  className='text-emerald-400'
                />
                Available Slots
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className='mt-2 w-full rounded-xl p-3 bg-[#0b0f0e]/90 border border-emerald-500/10 text-gray-300 focus:outline-none'
              >
                <option value=''>Select Slot</option>
                {availableSlots.map((slot, idx) => (
                  <option
                    key={idx}
                    value={slot}
                  >
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='text-sm text-gray-400 flex items-center gap-2'>
                <Building
                  size={16}
                  className='text-emerald-400'
                />
                Available Rooms
              </label>
              <select
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                disabled={!availableRooms?.length}
                className='mt-2 w-full rounded-xl p-3 bg-[#0b0f0e]/90 border border-emerald-500/10 text-gray-300 focus:outline-none'
              >
                <option value=''>
                  {availableRooms.length === 0
                    ? 'Room are not available'
                    : 'Select Room'}
                </option>
                {availableRooms.map((r) => (
                  <option
                    key={r._id}
                    value={r._id}
                  >
                    Room no {r.roomNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className='md:col-span-2'>
              <label className='text-sm text-gray-400 flex items-center gap-2'>
                <MessageSquare
                  size={16}
                  className='text-emerald-400'
                />
                Reason / Notes
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder='Describe your symptoms or reason for visit...'
                className='mt-2 w-full rounded-xl p-3 bg-[#0b0f0e]/90 border border-emerald-500/10 text-gray-300 focus:outline-none'
              />
            </div>

            <div className='md:col-span-2 flex gap-4 pt-2'>
              <button
                type='submit'
                className='w-fit px-6 py-2.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-medium rounded-xl hover:bg-emerald-500/30 transition-all'
              >
                {loading === true ? (
                  <LoaderCircle className='white h-6 w-6 animate-spin' />
                ) : (
                  'Book now'
                )}
              </button>
              <button
                type='reset'
                onClick={() => {
                  setTimeSlot('');
                  setRoom('');
                  setReason('');
                }}
                className='w-fit px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all'
              >
                Reset
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
