import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ user }) => {
  return (
    <header className='flex items-center justify-between p-4 border-b border-emerald-500/10 bg-[#101614] backdrop-blur-xl'>
      <h1 className='text-lg font-semibold text-emerald-400'>Your Dashboard</h1>

      <Link to={`/${user?.role}/profile`}>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 text-black flex items-center justify-center font-semibold'>
              {user?.name?.slice(0, 1)}
            </div>
            <div>
              <p className='text-sm font-medium text-white capitalize'>
                {user?.name}
              </p>
              <p className='text-xs text-gray-400'>View Profile</p>
            </div>
          </div>
        </div>
      </Link>
    </header>
  );
};

export default Navbar;
