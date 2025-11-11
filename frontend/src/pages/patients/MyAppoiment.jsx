import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, XCircle, Sun } from 'lucide-react';
import axios from 'axios';
import { getMyAppointment, updateCancelAppointment } from '@/api/pateint';

export default function MyAppointments() {
  const [tab, setTab] = useState('waiting');
  const [data, setData] = useState({
    waiting: [],
    completed: [],
    cancelled: [],
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await getMyAppointment();
        console.log(res.waiting);

        setData({
          waiting: res.waiting,
          completed: res.completed,
          cancelled: res.cancelled,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAppointments();
  }, []);

  const filtered = data[tab];

  const handleCancel = async (id) => {
    try {
      await updateCancelAppointment(id)
      setData((prev) => ({
        ...prev,
        waiting: prev.waiting.filter((a) => a._id !== id),
        cancelled: [
          ...prev.cancelled,
          { ...prev.waiting.find((a) => a._id === id), status: 'Cancelled' },
        ],
      }));
    } catch (error) {
      console.error('Cancel failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='space-y-6'
    >
      <div>
        <h1 className='text-3xl font-semibold text-white'>My Appointments</h1>
        <p className='text-sm text-gray-400 mt-1'>
          View and manage all your appointments.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className='mt-4'
      >
        <TabsList className='bg-[#111]/60 rounded-2xl flex gap-2 p-1 w-full sm:w-auto'>
          {[
            { value: 'waiting', label: 'Waiting', color: 'emerald' },
            { value: 'completed', label: 'Completed', color: 'teal' },
            { value: 'cancelled', label: 'Cancelled', color: 'red' },
          ].map(({ value, label, color }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 w-full sm:w-auto
                ${
                  tab === value
                    ? `bg-${color}-500/20 text-${color}-400 shadow-[0_0_10px_rgba(0,0,0,0.2)]`
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          value={tab}
          className='mt-6 space-y-4'
        >
          {filtered.length === 0 ? (
            <div className='text-center text-gray-500 py-12 italic'>
              No {tab} appointments found.
            </div>
          ) : (
            filtered.map((a) => (
              <motion.div
                key={a._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`p-5 rounded-2xl border transition-all duration-300 bg-[#0b0f0e]/80 
                  ${
                    a.isToday
                      ? 'border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'border-gray-800 hover:border-emerald-500/30'
                  }`}
                >
                  <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                    <div>
                      <h3 className='text-lg font-semibold text-white'>
                        {a?.doctorName || 'Dr. Unknown'}
                      </h3>
                      <p className='text-sm text-gray-400'>
                        {a.doctor?.specialization}
                      </p>

                      <div className='flex flex-wrap gap-3 mt-3 text-sm text-gray-400'>
                        <div className='flex items-center gap-1'>
                          <Calendar size={15} /> {a.date}
                          {a.isToday && (
                            <span className='ml-2 flex items-center gap-1 text-emerald-400 text-xs font-semibold'>
                              <Sun size={12} /> Today
                            </span>
                          )}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock size={15} /> {a.timeSlot}
                        </div>
                        {a.room && (
                          <div className='flex items-center gap-1'>
                            <User size={15} /> Room {a.room.roomNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex flex-col items-end gap-2'>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          a.status === 'Pending'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : a.status === 'Completed'
                              ? 'bg-teal-500/15 text-teal-400'
                              : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {a.status}
                      </span>

                      {a.status === 'Pending' && (
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-400 hover:text-red-500 flex items-center gap-1 text-xs px-2'
                          onClick={() => handleCancel(a._id)}
                        >
                          <XCircle size={14} /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
