import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  HeartPulse,
  CalendarDays,
  Users,
  LogIn,
  Users2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const App = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted dark:from-[#0a0a0a] dark:to-[#121212] transition-all text-foreground'>
      <header className='flex items-center justify-between px-8 py-5 backdrop-blur-lg bg-card/60 border-b border-border/40 shadow-sm sticky top-0 z-50'>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='flex items-center gap-2'
        >
          <div className='bg-primary/10 p-2 rounded-full'>
            <Stethoscope className='h-6 w-6 text-primary' />
          </div>
          <h1 className='text-xl font-semibold text-primary tracking-wide'>
            MediCare
          </h1>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className='hidden md:flex items-center gap-6 text-sm text-muted-foreground'
        >
          <Link
            to='/register'
            className='flex items-center gap-1 text-primary font-medium hover:underline'
          >
            <Users2 size={16} /> Register
          </Link>
          <Link
            to='/login'
            className='flex items-center gap-1 text-primary font-medium hover:underline'
          >
            <LogIn size={16} /> Login
          </Link>
        </motion.nav>
      </header>

      <section className='flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-28 py-20 gap-10'>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className='space-y-6 text-center md:text-left'
        >
          <h2 className='text-4xl md:text-5xl font-bold leading-tight'>
            Your Health, <span className='text-primary'>Our Priority 🩺</span>
          </h2>
          <p className='text-muted-foreground text-base md:text-lg max-w-lg'>
            Manage appointments, doctors, and patient records effortlessly with
            MediCare — the complete Clinic Management System built for modern
            healthcare.
          </p>

          <div className='flex flex-col sm:flex-row gap-3 justify-center md:justify-start'>
            <Link to='/register'>
              <Button className='bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl'>
                Get Started
              </Button>
            </Link>
            <a
              href='#features'
              className='px-6 py-3 rounded-xl border border-border/40 bg-background/60 hover:bg-muted transition'
            >
              Learn More
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className='relative w-full max-w-md'
        >
          <div className='absolute inset-0 bg-primary/10 rounded-full blur-3xl' />
          <img
            src='https://cdn-icons-png.flaticon.com/512/2966/2966482.png'
            alt='Clinic Illustration'
            className='relative z-10 w-full'
          />
        </motion.div>
      </section>

      <section
        id='features'
        className='px-8 md:px-16 lg:px-28 py-16 bg-card/40 backdrop-blur-xl border-t border-border/40'
      >
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='text-3xl font-semibold text-center mb-12 text-foreground'
        >
          Why Choose <span className='text-primary'>MediCare?</span>
        </motion.h3>

        <div className='grid md:grid-cols-3 gap-8'>
          {[
            {
              icon: <HeartPulse className='h-8 w-8 text-primary' />,
              title: 'Smart Appointments',
              desc: 'Avoid double-booking and manage appointments with real-time conflict checks.',
            },
            {
              icon: <CalendarDays className='h-8 w-8 text-primary' />,
              title: 'Doctor Scheduling',
              desc: 'Manage doctor shifts, availability, and patient queues seamlessly.',
            },
            {
              icon: <Users className='h-8 w-8 text-primary' />,
              title: 'Patient Records',
              desc: 'Store and access complete digital case histories securely in one place.',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='p-6 rounded-2xl bg-background/70 border border-border/40 shadow-md text-center space-y-3 hover:shadow-xl transition'
            >
              <div className='flex justify-center'>{feature.icon}</div>
              <h4 className='text-lg font-semibold text-foreground'>
                {feature.title}
              </h4>
              <p className='text-muted-foreground text-sm'>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer
        id='contact'
        className='px-8 py-8 text-center text-sm text-muted-foreground border-t border-border/40 bg-card/60 backdrop-blur-md'
      >
        <p>
          Abdul Rafey © {new Date().getFullYear()} MediCare — All rights
          reserved.
        </p>
        <p className='mt-1'>
          Built with ❤️ by MediCare — Empowering modern clinics with technology.
        </p>
      </footer>
    </div>
  );
};

export default App;
