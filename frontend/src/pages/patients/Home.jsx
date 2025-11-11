import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitsChart from '@/components/VisitsChart';
import AppointmentCard from '@/components/AppoimentCard';
import CaseHistoryTable from '@/pages/patients/CaseHistory';
import { getPatientOverview } from '@/api/pateint';

export default function Home() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [recentCaseHistory, setRecentCaseHistory] = useState([]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await getPatientOverview();

        console.log(res);

        if (res?.success) {
          const data = res.data;

          setChartData(data.chartData || []);
          setPendingAppointments(data.pendingAppointments || []);
          setCompletedAppointments(data.completedAppointments || []);
          setRecentCaseHistory(data.recentCaseHistory || []);
        }
      } catch (error) {
        console.error('Error fetching patient overview:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  console.log(pendingAppointments);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-[70vh] text-gray-400'>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className='space-y-10'>
      <div className='bg-[#101614] rounded-2xl p-6 border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]'>
        <h2 className='text-2xl font-semibold mb-4 text-white'>
          Health Visits Overview (This Month)
        </h2>
        <VisitsChart data={chartData} />
      </div>

      <div className='bg-[#101614] rounded-2xl p-6 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'>
        <h2 className='text-xl font-semibold text-white mb-2'>
          Pending Appointments
        </h2>
        <p className='text-gray-400 text-sm mb-4'>
          Appointments awaiting confirmation or approval.
        </p>

        {pendingAppointments.length > 0 ? (
          <div className='grid md:grid-cols-2 gap-4'>
            {pendingAppointments.map((a, i) => (
              <AppointmentCard
                key={i}
                appointment={a}
                doctorName={a.doctorName}
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-sm'>
            No pending appointments right now.
          </p>
        )}
      </div>

      <div className='bg-[#101614] rounded-2xl p-6 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'>
        <h2 className='text-xl font-semibold text-white mb-2'>
          Completed Appointments
        </h2>
        <p className='text-gray-400 text-sm mb-4'>
          Your recently completed consultations.
        </p>

        {completedAppointments.length > 0 ? (
          <div className='grid md:grid-cols-2 gap-4'>
            {completedAppointments.map((a, i) => (
              <AppointmentCard
                key={i}
                appointment={a}
                doctorName={a.doctorName}
              />
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-sm'>
            No completed appointments yet.
          </p>
        )}
      </div>

      <div className='bg-[#101614] rounded-2xl p-6 border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h2 className='text-xl font-semibold text-white'>
              Recent Case History
            </h2>
            <p className='text-gray-400 text-sm'>
              A quick view of your latest diagnoses.
            </p>
          </div>
          <button
            onClick={() => navigate('/patient/case-history')}
            className='text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-all'
          >
            View More →
          </button>
        </div>

        <CaseHistoryTable rows={recentCaseHistory.slice(0, 2)} />
      </div>
    </div>
  );
}
