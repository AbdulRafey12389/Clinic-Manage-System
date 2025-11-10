import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { checkTokenValidity } from '@/lib/utils';

export default function DoctorDashboardLayout() {
  const location = useLocation();

  const valid = checkTokenValidity();
  const navigate = useNavigate();

  useEffect(() => {
    if (!valid) {
      navigate('/login');
      return;
    }
  }, [navigate, valid]);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className='flex bg-gradient-to-br from-[#050505] via-[#0a0f0a] to-[#0f1410] text-gray-100 min-h-screen'>
      <Sidebar role='doctor' />

      <main className='flex-1 flex flex-col'>
        <Navbar user={user} />
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-[#050707]/70 backdrop-blur-lg'
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
