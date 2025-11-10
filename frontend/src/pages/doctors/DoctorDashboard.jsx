import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Users, ClipboardList, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VisitsChart from '@/components/VisitsChart';
import AppointmentCard from '@/components/AppoimentCard';
import { getDoctorDashboard } from '@/api/doctor';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    stats: {
      totalAppointments: 0,
      todayAppointmentsCount: 0,
      totalPatients: 0,
      totalCaseReviewed: 0,
    },
    todayAppointments: [],
    chartData: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDoctorDashboard();
        if (res?.success) {
          const data = res.data;

          setOverview({
            stats: data.stats,
            todayAppointments: data.todayAppointments,
            chartData: data.chartData,
          });
          setError('');
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (err) {
        console.error('Error fetching doctor dashboard:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      label: "Today's Appointments",
      value: overview?.stats?.todayAppointmentsCount,
      icon: CalendarDays,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Total Patients',
      value: overview?.stats?.totalPatients,
      icon: Users,
      color: 'text-teal-400 bg-teal-500/10',
    },
    {
      label: 'Cases Reviewed',
      value: overview?.stats?.totalCaseReviewed,
      icon: ClipboardList,
      color: 'text-cyan-400 bg-cyan-500/10',
    },
  ];

  const user = JSON.parse(localStorage.getItem('user'));

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
          <Stethoscope className='text-emerald-400' /> Doctor Dashboard
        </h1>
        <p className='text-sm text-gray-400'>Welcome back, {user.name} 👋</p>
      </motion.div>

      {/* ---------- Stats Cards ---------- */}
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <Card
              key={i}
              className='flex items-center justify-between p-5 bg-[#101614] border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)] rounded-2xl'
            >
              <div>
                <p className='text-sm text-gray-400'>{item.label}</p>
                <h2 className='text-2xl font-semibold text-white'>
                  {loading ? '...' : item.value}
                </h2>
              </div>
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon size={20} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* ---------- Chart Section ---------- */}
      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl'>
        <h2 className='text-lg font-semibold mb-4 text-white'>
          Appointment Overview
        </h2>
        {loading ? (
          <p className='text-gray-500'>Loading chart...</p>
        ) : overview.chartData.length > 0 ? (
          <VisitsChart data={overview.chartData} />
        ) : (
          <p className='text-gray-400 text-sm'>
            No appointment data available.
          </p>
        )}
      </Card>

      {/* ---------- Today's Appointments ---------- */}
      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>
            Today’s Appointments
          </h2>
          <button className='text-sm text-emerald-400 hover:underline'>
            View All
          </button>
        </div>

        {loading ? (
          <p className='text-gray-500'>Loading appointments...</p>
        ) : overview.todayAppointments.length > 0 ? (
          <div className='grid md:grid-cols-2 gap-4'>
            {overview.todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment._id}
                appointment={appointment} // pass properly
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-400 text-sm'>No appointments for today.</p>
        )}

        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
      </Card>
    </div>
  );
};

export default DoctorDashboard;
