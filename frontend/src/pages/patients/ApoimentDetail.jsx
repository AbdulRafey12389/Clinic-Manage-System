import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  UserRound,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  XCircle,
  CheckCircle,
} from 'lucide-react';

export default function AppointmentDetail() {
  // 🔹 Dummy appointment data
  const [appointment, setAppointment] = useState({
    id: 'APT-001',
    date: '2025-11-10',
    time: '11:00 AM - 11:30 AM',
    room: 'Room 2',
    status: 'Confirmed',
    reason: 'Chest Pain and Regular Checkup',
    doctor: {
      name: 'Dr. Ali Khan',
      specialization: 'Cardiology',
      experience: '8 years',
      phone: '+92 300 1234567',
      email: 'alikhan@medicare.com',
      image: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png',
    },
  });

  const [cancelled, setCancelled] = useState(false);

  const handleCancel = () => {
    setCancelled(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='max-w-5xl mx-auto space-y-8'
    >
      <h1 className='text-2xl font-semibold text-white flex items-center gap-2'>
        <FileText className='text-emerald-400' /> Appointment Details
      </h1>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)] space-y-6'>
        {/* Doctor Info Section */}
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          <div className='relative'>
            <img
              src={appointment.doctor.image}
              alt={appointment.doctor.name}
              className='w-32 h-32 rounded-xl object-cover border-2 border-emerald-500/30'
            />
            <div className='absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full'>
              <Stethoscope size={14} />
            </div>
          </div>

          <div className='space-y-1'>
            <h2 className='text-xl font-semibold text-white'>
              {appointment.doctor.name}
            </h2>
            <p className='text-emerald-400 font-medium'>
              {appointment.doctor.specialization}
            </p>
            <p className='text-gray-400 text-sm'>
              Experience: {appointment.doctor.experience}
            </p>

            <div className='flex items-center gap-3 text-gray-400 text-sm pt-2'>
              <Phone size={14} /> {appointment.doctor.phone}
            </div>
            <div className='flex items-center gap-3 text-gray-400 text-sm'>
              <Mail size={14} /> {appointment.doctor.email}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='h-px bg-emerald-500/10' />

        {/* Appointment Info Section */}
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
          <div className='flex items-center gap-3'>
            <Calendar
              className='text-emerald-400'
              size={18}
            />
            <div>
              <p className='text-xs text-gray-400'>Date</p>
              <p className='text-white font-medium'>{appointment.date}</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <Clock
              className='text-emerald-400'
              size={18}
            />
            <div>
              <p className='text-xs text-gray-400'>Time Slot</p>
              <p className='text-white font-medium'>{appointment.time}</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <MapPin
              className='text-emerald-400'
              size={18}
            />
            <div>
              <p className='text-xs text-gray-400'>Room</p>
              <p className='text-white font-medium'>{appointment.room}</p>
            </div>
          </div>

          <div className='flex items-center gap-3'>
            <UserRound
              className='text-emerald-400'
              size={18}
            />
            <div>
              <p className='text-xs text-gray-400'>Status</p>
              <p
                className={`font-medium ${
                  cancelled
                    ? 'text-red-400'
                    : appointment.status === 'Confirmed'
                      ? 'text-emerald-400'
                      : 'text-yellow-400'
                }`}
              >
                {cancelled ? 'Cancelled' : appointment.status}
              </p>
            </div>
          </div>
        </div>

        {/* Reason / Notes */}
        <div className='pt-4'>
          <p className='text-sm text-gray-400 mb-1'>Reason / Notes</p>
          <p className='text-white bg-[#0b0f0e] p-3 rounded-xl border border-emerald-500/10 text-sm'>
            {appointment.reason}
          </p>
        </div>

        {/* Cancel Button */}
        {!cancelled && (
          <div className='pt-6 flex justify-end'>
            <Button
              onClick={handleCancel}
              className='bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center gap-2'
            >
              <XCircle size={16} /> Cancel Appointment
            </Button>
          </div>
        )}

        {cancelled && (
          <div className='pt-4 flex items-center gap-2 text-emerald-400 text-sm'>
            <CheckCircle size={16} />
            Appointment has been successfully cancelled.
          </div>
        )}
      </Card>
    </motion.div>
  );
}
