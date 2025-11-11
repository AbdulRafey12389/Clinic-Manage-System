import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Stethoscope, Building, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import VisitsChart from '@/components/VisitsChart';
import { getDashboardOverview } from '@/api/admin/adminDashboard';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [overview, setOverview] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalRooms: 0,
    totalAppointments: 0,
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardOverview();
        if (res.success) {
          setOverview(res.overview);
          setRecentDoctors(res.recentDoctors);
          setChartData(res.chartData);
        } else {
          toast.error(res.message || 'Failed to load dashboard');
        }
      } catch (error) {
        console.error('Dashboard Fetch Error:', error);
        toast.error('Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: 'Total Doctors',
      value: overview.totalDoctors,
      icon: Stethoscope,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      label: 'Total Patients',
      value: overview.totalPatients,
      icon: Users,
      color: 'text-teal-400 bg-teal-500/10',
    },
    {
      label: 'Total Rooms',
      value: overview.totalRooms,
      icon: Building,
      color: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      label: 'Total Appointments',
      value: overview.totalAppointments,
      icon: BarChart,
      color: 'text-purple-400 bg-purple-500/10',
    },
  ];

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[80vh] text-emerald-400 text-lg'>
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-2xl font-semibold flex items-center gap-2'>
          <BarChart className='text-emerald-400' /> Admin Dashboard
        </h1>
        <p className='text-sm text-gray-400'>Welcome back, Admin 👋</p>
      </motion.div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5'>
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
                  {item.value}
                </h2>
              </div>
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon size={20} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl'>
        <h2 className='text-lg font-semibold mb-4 text-white'>
          Appointments Overview
        </h2>
        <VisitsChart data={chartData} />
      </Card>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>
            Recently Added Doctors
          </h2>
          <Link
            to={'/admin/manage-doctors'}
            className='text-sm text-emerald-400 hover:underline'
          >
            View All
          </Link>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          {recentDoctors.length > 0 ? (
            recentDoctors.map((doc, i) => (
              <Card
                key={i}
                className='p-4 flex items-center justify-between bg-[#101614]/90 border border-emerald-500/10 rounded-2xl'
              >
                <div>
                  <p className='text-white font-medium'>{doc._id.name}</p>
                  <p className='text-gray-400 text-sm'>
                    {doc.specialization || 'Not specified'}
                  </p>
                </div>
                <Link
                  to={'/admin/manage-doctors'}
                  className='text-sm text-emerald-400 hover:underline'
                >
                  View Details
                </Link>
              </Card>
            ))
          ) : (
            <p className='text-gray-400 text-sm'>No doctors found.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
