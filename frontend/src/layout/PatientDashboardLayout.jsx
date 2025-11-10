import React, { useEffect } from 'react';
import { Outlet, redirect, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { checkTokenValidity } from '@/lib/utils';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const valid = checkTokenValidity();

  useEffect(() => {
    if (!valid) {
      navigate('/login');
      return;
    }
  }, [navigate, valid]);

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className='flex bg-gradient-to-br from-[#050505] via-[#0a0f0a] to-[#0f1410] text-gray-100 min-h-screen'>
      <Sidebar />
      <main className='flex-1 flex flex-col'>
        <Navbar user={user} />
        <div className='flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-[#050707]/70 backdrop-blur-lg'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
