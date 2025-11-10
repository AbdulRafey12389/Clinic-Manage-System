import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  User,
  BellRing,
  LogOut,
  Stethoscope,
  Users,
  Building,
  BarChart,
  AppWindow,
  BriefcaseMedical,
} from 'lucide-react';

const Sidebar = ({ role = 'patient' }) => {
  const { pathname } = useLocation();

  // 🔹 Define role-based navigation
  const navItems = {
    patient: [
      { to: '/patient/dashboard', label: 'Overview', icon: LayoutDashboard },
      {
        to: '/patient/doctor-list',
        label: 'Available Doctors',
        icon: BriefcaseMedical,
      },
      {
        to: '/patient/book-appointment',
        label: 'Book Appointments',
        icon: Calendar,
      },
      {
        to: '/patient/my-appointments',
        label: 'My Appointments',
        icon: AppWindow,
      },
      {
        to: '/patient/case-history',
        label: 'Case History',
        icon: ClipboardList,
      },
      { to: '/patient/profile', label: 'Profile', icon: User },
    ],
    doctor: [
      { to: '/doctor/dashboard', label: 'Overview', icon: LayoutDashboard },
      { to: '/doctor/appointments', label: 'Appointments', icon: Calendar },
      {
        to: '/doctor/case-records',
        label: 'Case Records',
        icon: ClipboardList,
      },
      { to: '/doctor/profile', label: 'Profile', icon: User },
    ],
    admin: [
      { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
      {
        to: '/admin/manage-doctors',
        label: 'Manage Doctors',
        icon: Stethoscope,
      },
      { to: '/admin/manage-patients', label: 'Manage Patients', icon: Users },
      { to: '/admin/manage-rooms', label: 'Manage Rooms', icon: Building },
    ],
  };

  const items = navItems[role] || [];

  const navigate = useNavigate();

  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <aside className='w-72 min-h-screen bg-[#101614] backdrop-blur-xl border-r border-emerald-600/20 flex flex-col justify-between py-6 px-5 transition-all duration-300'>
      {/* ---------- Top Branding ---------- */}
      <div>
        <div className='flex items-center gap-3 mb-10'>
          <div className='bg-gradient-to-br from-emerald-500/30 to-teal-500/10 p-3 rounded-xl'>
            <Stethoscope className='h-6 w-6 text-emerald-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>MediCare</h3>
            <p className='text-xs text-gray-400 capitalize'>{role} panel</p>
          </div>
        </div>

        {/* ---------- Navigation Links ---------- */}
        <nav className='flex flex-col gap-1'>
          {items.map((item) => {
            const isActive = pathname === item.to;
            const Icon = item.icon;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border-l-2 border-emerald-500 shadow-[inset_0_0_8px_rgba(16,185,129,0.3)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div
                  className={`p-1.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-gray-400 group-hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ---------- Logout Button ---------- */}
      <button
        onClick={handlelogout}
        className='flex items-center gap-2 text-gray-400 hover:text-red-400 mt-auto px-4 py-2 rounded-xl transition-all'
      >
        <LogOut size={16} /> Logout
      </button>
    </aside>
  );
};

export default Sidebar;
