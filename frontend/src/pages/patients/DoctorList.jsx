import React, { useEffect, useState } from 'react';
import { Users, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getAvailableDoctors } from '@/api/pateint';
import { toast } from 'sonner';

export default function DoctorListPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = dayNames[today.getDay()];
  const date = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const res = await getAvailableDoctors();
      console.log(res);

      if (res.success) {
        setDoctors(res.data);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };
    fetchDoctors();
  }, [date, day]);

  const handleBook = (doctor) => {
    navigate('/patient/book-appointment', { state: { doctor } });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-20 text-gray-400'>
        Loading available doctors...
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
        <p>No doctors are available today.</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6 py-6'>
      <h1 className='text-2xl font-semibold text-white'>
        Available Doctors Today
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {doctors &&
          doctors.map((doc, idx) => (
            <DoctorCard
              key={idx}
              doctor={doc}
              onBook={handleBook}
            />
          ))}
      </div>
    </div>
  );
}

const DoctorCard = ({ doctor, onBook }) => {
  const availableSlots = Array.isArray(doctor?.availableSlots)
    ? doctor.availableSlots
    : [];

  return (
    <Card className='p-5 rounded-2xl bg-[#101614]/90 border border-emerald-500/10 hover:border-emerald-500/30 hover:shadow-[0_0_10px_rgba(16,185,129,0.1)] transition-all'>
      <div className='flex items-center gap-4'>
        {doctor?.profilePic ? (
          <img
            src={doctor?.profilePic}
            alt='Doctor'
            className='w-16 h-16 rounded-full object-cover border border-emerald-500/20'
          />
        ) : (
          <div className='w-16 h-16 rounded-full flex items-center justify-center bg-[#0b0f0e] border border-emerald-500/20'>
            <Users className='text-emerald-400 w-8 h-8' />
          </div>
        )}

        <div className='flex-1'>
          <h4 className='text-white font-semibold text-lg'>{doctor.name}</h4>
          <p className='text-gray-400 text-sm'>{doctor.specialization}</p>
          <p className='text-gray-500 text-xs mb-2'>
            Experience: {doctor?.experience} yrs
          </p>

          <div className='flex flex-wrap gap-3 text-gray-400 text-xs mb-3'>
            <div className='flex items-center gap-1'>
              <Calendar
                size={14}
                className='text-emerald-400'
              />{' '}
              Today Slots
            </div>
            <div className='flex items-center gap-1'>
              <Clock
                size={14}
                className='text-emerald-400'
              />{' '}
              {availableSlots.length > 0
                ? `${availableSlots.length} slot(s) available`
                : 'No slots'}
            </div>
          </div>

          <div className='flex flex-wrap gap-2'>
            {availableSlots?.slice(0, 4).map((slot, i) => (
              <span
                key={i}
                className='text-xs text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md'
              >
                {slot}
              </span>
            ))}
            {availableSlots?.length > 4 && (
              <span className='text-xs text-gray-400'>+ more</span>
            )}
          </div>

          <Button
            onClick={() => onBook(doctor)}
            className='mt-4 bg-emerald-500 hover:bg-emerald-600 text-white text-sm'
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </Card>
  );
};
