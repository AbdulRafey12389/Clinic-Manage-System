import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { User } from 'lucide-react';
import { getAllPatient } from '@/api/admin/adminGetPatient';

export default function ManagePatients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await getAllPatient();
        console.log(res);

        setPatients(res?.patients || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-2xl font-semibold flex items-center gap-2'>
          <User className='text-emerald-400' /> Manage Patients
        </h1>
        <p className='text-sm text-gray-400'>
          View all registered patients in the system
        </p>
      </motion.div>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl overflow-x-auto'>
        <table className='w-full text-sm text-gray-300'>
          <thead className='text-gray-400 border-b border-emerald-500/10'>
            <tr>
              <th className='py-3 text-left'>Patient Name</th>
              <th className='py-3 text-left'>Email</th>
              <th className='py-3 text-left'>Gender</th>
              <th className='py-3 text-left'>Age</th>
              <th className='py-3 text-left'>Date</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p, i) => (
              <tr
                key={i}
                className='border-b border-emerald-500/5 hover:bg-[#0b0f0e]/40 transition'
              >
                <td className='py-3'>{p.name}</td>
                <td className='py-3'>{p.email}</td>
                <td className='py-3'>{p.gender}</td>
                <td className='py-3'>{p.age}</td>
                <td className='py-3'>{p.createdAt.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {patients.length === 0 && (
          <p className='text-center text-gray-500 py-4'>No patients found.</p>
        )}
      </Card>
    </div>
  );
}
