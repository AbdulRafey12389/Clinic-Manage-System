import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

const AppointmentCard = ({ appointment, doctorName = null }) => {
  const statusColors = {
    Confirmed:
      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    Completed: 'bg-teal-500/10 text-teal-400 border border-teal-400/20',
    Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  return (
    <div
      className='p-5 rounded-2xl transition-all duration-300
                 bg-[#0b0f0e]/90 border border-emerald-500/10
                 hover:border-emerald-500/30 hover:shadow-[0_0_10px_rgba(16,185,129,0.1)]'
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h4 className='font-semibold text-lg text-white capitalize'>
            {doctorName ? doctorName : appointment?.patient.name}
          </h4>
          <p className='text-sm text-gray-400'>
            {appointment?.doctor?.specialization}
          </p>
        </div>

        <div className='text-right'>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[appointment?.status] || 'bg-white/5 text-gray-400'
            }`}
          >
            {appointment?.status}
          </span>
        </div>
      </div>

      <div className='mt-4 flex flex-wrap gap-4 text-sm text-gray-400'>
        <div className='flex items-center gap-2'>
          <Calendar
            size={14}
            className='text-emerald-400'
          />{' '}
          {appointment?.date}
        </div>
        <div className='flex items-center gap-2'>
          <Clock
            size={14}
            className='text-emerald-400'
          />{' '}
          {appointment?.timeSlot}
        </div>
        <div className='flex items-center gap-2'>
          <Users
            size={14}
            className='text-emerald-400'
          />{' '}
          Room {appointment?.room?.roomNumber}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
