import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  CalendarDays,
  User,
  Stethoscope,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';

export default function ManagePatients() {
  const [filterDoctor, setFilterDoctor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');

  // Dummy data (in real app → from backend)
  const [appointments, setAppointments] = useState([
    {
      patientName: 'Ahmed Raza',
      doctorName: 'Dr. Ali Khan',
      specialization: 'Cardiology',
      date: '2025-11-10',
      day: 'Monday',
      timeSlot: '10:00 AM - 10:30 AM',
      room: '2A',
      status: 'Pending',
    },
    {
      patientName: 'Sana Tariq',
      doctorName: 'Dr. Fatima Noor',
      specialization: 'Pediatrics',
      date: '2025-11-11',
      day: 'Tuesday',
      timeSlot: '12:00 PM - 12:30 PM',
      room: '3C',
      status: 'Approved',
    },
    {
      patientName: 'Bilal Hussain',
      doctorName: 'Dr. Ali Raza',
      specialization: 'Neurology',
      date: '2025-11-11',
      day: 'Tuesday',
      timeSlot: '02:00 PM - 02:30 PM',
      room: '4B',
      status: 'Rejected',
    },
  ]);

  // Filter logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const doctorMatch = filterDoctor ? a.doctorName === filterDoctor : true;
      const statusMatch = filterStatus ? a.status === filterStatus : true;
      const searchMatch = a.patientName
        .toLowerCase()
        .includes(search.toLowerCase());
      return doctorMatch && statusMatch && searchMatch;
    });
  }, [appointments, filterDoctor, filterStatus, search]);

  // Approve / Reject
  const handleStatusChange = (index, newStatus) => {
    const updated = [...appointments];
    updated[index].status = newStatus;
    setAppointments(updated);
  };

  return (
    <div className='space-y-8'>
      {/* ---------- Header ---------- */}
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
          View and approve patient appointments
        </p>
      </motion.div>

      {/* ---------- Filters ---------- */}
      <Card className='p-5 bg-[#101614] border border-emerald-500/10 rounded-2xl flex flex-wrap gap-4 items-center'>
        <div className='flex items-center gap-2'>
          <Filter
            className='text-emerald-400'
            size={16}
          />
          <Input
            placeholder='Search patient...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='bg-[#0b0f0e]/80 border border-emerald-500/10 text-gray-300'
          />
        </div>

        <Select onValueChange={setFilterDoctor}>
          <SelectTrigger className='bg-[#0b0f0e]/80 border border-emerald-500/10 text-gray-300 w-[180px]'>
            <SelectValue placeholder='Filter by Doctor' />
          </SelectTrigger>
          <SelectContent className='bg-[#0b0f0e] text-gray-200 border-emerald-500/10'>
            <SelectItem value='Dr. Ali Khan'>Dr. Ali Khan</SelectItem>
            <SelectItem value='Dr. Fatima Noor'>Dr. Fatima Noor</SelectItem>
            <SelectItem value='Dr. Ali Raza'>Dr. Ali Raza</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterStatus}>
          <SelectTrigger className='bg-[#0b0f0e]/80 border border-emerald-500/10 text-gray-300 w-[180px]'>
            <SelectValue placeholder='Filter by Status' />
          </SelectTrigger>
          <SelectContent className='bg-[#0b0f0e] text-gray-200 border-emerald-500/10'>
            <SelectItem value='Pending'>Pending</SelectItem>
            <SelectItem value='Approved'>Approved</SelectItem>
            <SelectItem value='Rejected'>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* ---------- Appointment Table ---------- */}
      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl overflow-x-auto'>
        <table className='w-full text-sm text-gray-300'>
          <thead className='text-gray-400 border-b border-emerald-500/10'>
            <tr>
              <th className='py-3 text-left'>Patient</th>
              <th className='py-3 text-left'>Doctor</th>
              <th className='py-3 text-left'>Specialization</th>
              <th className='py-3 text-left'>Date</th>
              <th className='py-3 text-left'>Day</th>
              <th className='py-3 text-left'>Time Slot</th>
              <th className='py-3 text-left'>Room</th>
              <th className='py-3 text-left'>Status</th>
              <th className='py-3 text-center'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.map((a, i) => (
              <tr
                key={i}
                className='border-b border-emerald-500/5 hover:bg-[#0b0f0e]/40 transition'
              >
                <td className='py-3'>{a.patientName}</td>
                <td className='py-3'>{a.doctorName}</td>
                <td className='py-3'>{a.specialization}</td>
                <td className='py-3'>{a.date}</td>
                <td className='py-3'>{a.day}</td>
                <td className='py-3'>{a.timeSlot}</td>
                <td className='py-3'>{a.room}</td>
                <td
                  className={`py-3 font-medium ${
                    a.status === 'Approved'
                      ? 'text-emerald-400'
                      : a.status === 'Rejected'
                        ? 'text-red-400'
                        : 'text-yellow-400'
                  }`}
                >
                  {a.status}
                </td>
                <td className='py-3 flex justify-center gap-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-emerald-400 hover:bg-emerald-500/10'
                    onClick={() => handleStatusChange(i, 'Approved')}
                  >
                    <Check size={16} />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-red-400 hover:bg-red-500/10'
                    onClick={() => handleStatusChange(i, 'Rejected')}
                  >
                    <X size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAppointments.length === 0 && (
          <p className='text-center text-gray-500 py-4'>
            No appointments found.
          </p>
        )}
      </Card>
    </div>
  );
}
