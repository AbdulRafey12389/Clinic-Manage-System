import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UserRound } from 'lucide-react';

export default function DoctorProfile({ doctor }) {
  const data = doctor || {
    name: 'Dr. Sarah Khan',
    email: 'sarah.khan@example.com',
    specialization: 'Cardiology',
    timing: '10:00 AM - 4:00 PM',
    workingDays: ['Monday', 'Wednesday', 'Friday'],
    profilePic: null,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='max-w-3xl mx-auto space-y-8'
    >
      <h1 className='text-2xl font-semibold text-white'>Doctor Profile</h1>

      <Card className='p-6 rounded-2xl bg-[#101614] border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]'>
        <div className='flex flex-col items-center gap-4'>
          {data.profilePic ? (
            <img
              src={data.profilePic}
              alt='Doctor Profile'
              className='w-28 h-28 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg'
            />
          ) : (
            <div className='w-28 h-28 rounded-full flex items-center justify-center bg-[#0b0f0e] border border-emerald-500/20'>
              <UserRound className='text-emerald-400 w-10 h-10' />
            </div>
          )}

          <h2 className='text-xl font-medium text-white'>{data.name}</h2>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
          <div>
            <Label className='text-gray-400'>Email</Label>
            <p className='text-white mt-1'>{data.email}</p>
          </div>

          <div>
            <Label className='text-gray-400'>Specialization</Label>
            <p className='text-white mt-1'>{data.specialization}</p>
          </div>

          <div>
            <Label className='text-gray-400'>Working Days</Label>
            <p className='text-white mt-1'>{data.workingDays.join(', ')}</p>
          </div>

          <div>
            <Label className='text-gray-400'>Timing</Label>
            <p className='text-white mt-1'>{data.timing}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
