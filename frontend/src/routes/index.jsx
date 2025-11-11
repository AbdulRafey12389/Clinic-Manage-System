import { createBrowserRouter } from 'react-router-dom';

import PatientDashboardLayout from '@/layout/PatientDashboardLayout';
import DoctorDashboardLayout from '@/layout/DoctorDashboardLayout';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';

import App from '@/App';

import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

import Home from '@/pages/patients/Home';
import BookAppointment from '@/pages/patients/BookAppoiment';
import CaseHistory from '@/pages/patients/CaseHistory';
import MyAppointments from '@/pages/patients/MyAppoiment';
import Profile from '@/pages/patients/Profile';
import AppointmentDetail from '@/pages/patients/ApoimentDetail';
import DoctorList from '@/pages/patients/DoctorList';

import DoctorDashboard from '@/pages/doctors/DoctorDashboard';
import DoctorAppointments from '@/pages/doctors/DocotorAppoinment';
import DoctorCaseRecords from '@/pages/doctors/DoctorCaseRecord';
import DoctorProfile from '@/pages/doctors/DoctorProfile';

import AdminDashboard from '@/pages/Admin/AdminDashboard';
import AdminManageDoctor from '@/pages/Admin/AminManageDoctor';
import AdminManagePatient from '@/pages/Admin/AdminManagePatient';
import AdminManageRoom from '@/pages/Admin/AdminManageRoom';

import registerAction from '@/routes/authActions/registerFunction';
import loginAction from '@/routes/authActions/loginFunction';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/register',
    element: <Register />,
    action: registerAction,
  },
  {
    path: '/login',
    element: <Login />,
    action: loginAction,
  },

  {
    path: '/',
    element: <PatientDashboardLayout />,
    children: [
      {
        path: 'patient/dashboard',
        element: <Home />,
        index: true,
      },

      {
        path: '/patient/doctor-list',
        element: <DoctorList />,
      },

      {
        path: 'patient/book-appointment',
        element: <BookAppointment />,
      },

      {
        path: 'patient/my-appointments',
        element: <MyAppointments />,
      },

      {
        path: 'patient/case-history',
        element: <CaseHistory />,
      },
      {
        path: 'patient/profile',
        element: <Profile />,
      },
    ],
  },

  {
    path: '/patient/appointment/:appoimentId',
    element: <AppointmentDetail />,
  },

  {
    path: '/',
    element: <DoctorDashboardLayout />,
    children: [
      {
        path: 'doctor/dashboard',
        element: <DoctorDashboard />,
      },

      {
        path: '/doctor/appointments',
        element: <DoctorAppointments />,
      },

      {
        path: '/doctor/case-records',
        element: <DoctorCaseRecords />,
      },

      {
        path: '/doctor/profile',
        element: <DoctorProfile />,
      },
    ],
  },

  {
    path: '/',
    element: <AdminDashboardLayout />,
    children: [
      {
        path: 'admin/dashboard',
        element: <AdminDashboard />,
      },

      {
        path: 'admin/manage-doctors',
        element: <AdminManageDoctor />,
      },

      {
        path: 'admin/manage-patients',
        element: <AdminManagePatient />,
      },

      {
        path: 'admin/manage-rooms',
        element: <AdminManageRoom />,
      },
    ],
  },
]);

export default router;
