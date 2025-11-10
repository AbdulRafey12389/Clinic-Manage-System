import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, CheckCircle2, XCircle } from 'lucide-react';
import { getDoctorAppointments, updateAppointment } from '@/api/doctor';
import { toast } from 'sonner';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getDoctorAppointments(filter);
      if (res.success) setAppointments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const handleStatusChange = async (id, newStatus) => {
    const confirm = window.confirm(`Mark appointment as "${newStatus}"?`);
    if (!confirm) return;

    try {
      const res = await updateAppointment(id, newStatus);
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
        );
        toast.success(res.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'Completed':
        return 'text-blue-400 bg-blue-500/10';
      case 'Cancelled':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-2xl font-semibold'>Manage Appointments</h1>
        <p className='text-gray-400 text-sm'>
          View, filter, and update appointment statuses.
        </p>
      </motion.div>

      <div className='flex flex-wrap gap-3'>
        {['All', 'Pending', 'Completed', 'Cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-all duration-300 ${
              filter === f
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'text-gray-400 border-gray-700 hover:text-white hover:border-emerald-500/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className='grid md:grid-cols-2 gap-5'>
        {appointments.map((a) => (
          <Card
            key={a._id}
            className='bg-[#101614] p-5 rounded-2xl border border-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.05)]'
          >
            <div className='flex justify-between items-start'>
              <div>
                <h3 className='text-lg font-semibold text-white'>
                  {a.patient?.name || 'Unknown'}
                </h3>
                <div className='text-sm text-gray-400 space-y-1 mt-1'>
                  <p className='flex items-center gap-2'>
                    <Calendar size={14} /> {a.date}
                  </p>
                  <p className='flex items-center gap-2'>
                    <Clock size={14} /> {a.timeSlot}
                  </p>
                  <p className='flex items-center gap-2'>
                    <Users size={14} /> Room {a.room?.roomNumber || 'N/A'}
                  </p>
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(a.status)}`}
              >
                {a.status}
              </div>
            </div>

            <div className='flex gap-2 mt-4'>
              {a.status === 'Pending' && (
                <>
                  <Button
                    size='sm'
                    onClick={() => handleStatusChange(a._id, 'Completed')}
                    className='bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  >
                    <CheckCircle2
                      size={14}
                      className='mr-1'
                    />{' '}
                    Complete
                  </Button>
                  <Button
                    size='sm'
                    onClick={() => handleStatusChange(a._id, 'Cancelled')}
                    className='bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  >
                    <XCircle
                      size={14}
                      className='mr-1'
                    />{' '}
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {!loading && appointments.length === 0 && (
        <p className='text-center text-gray-500 text-sm mt-6'>
          No appointments found.
        </p>
      )}
    </div>
  );
};

export default DoctorAppointments;
