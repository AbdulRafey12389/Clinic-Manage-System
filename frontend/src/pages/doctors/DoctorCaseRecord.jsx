import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  UserRound,
  Stethoscope,
  FileText,
  Brain,
  LoaderCircle,
} from 'lucide-react';
import {
  createCasehistory,
  doctorCompletedAppointment,
  doctorGenerateAISummary,
  getDoctorCaseHistories,
} from '@/api/doctor';
import { toast } from 'sonner';

const DoctorCaseRecords = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    (async () => {
      try {
        const getRes = await getDoctorCaseHistories();
        const res = await doctorCompletedAppointment();
        if (res.success === true) {
          setPatients(res.data);
          setRecords(getRes.cases);
        } else {
          toast.error(res.message);
          toast.error(getRes.message);
        }
      } catch (error) {
        console.error('Error fetching completed appointments:', error);
      }
    })();
  }, []);

  // 🔹 Form state
  const [form, setForm] = useState({
    appointmentId: '',
    patient: '',
    diagnosis: '',
    prescription: '',
    followUp: '',
    aiSummary: '',
  });

  const [aiSummary, setAiSummary] = useState('');
  const [records, setRecords] = useState([]);

  // 🔹 Handle input change (main fix)
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'patient') {
      const selectedPatient = patients.find((p) => p._id === value);
      if (selectedPatient) {
        setForm((prev) => ({
          ...prev,
          appointmentId: selectedPatient._id,
          patient: selectedPatient.patient?.name || '',
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Save record
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.patient || !form.diagnosis) return;

    setLoadingForm(true);
    const newRecord = {
      ...form,
      date: new Date().toISOString().split('T')[0],
    };

    setRecords((prev) => [newRecord, ...prev]);

    try {
      setLoadingForm(true);

      const response = await createCasehistory({
        ...form,
        doctorName: user.name,
      });
      toast.success(response.message);
      setLoadingForm(false);
    } catch (error) {
      console.error('Error to creating case history', error);
      toast.error('Error to creating case history', error.message);
      setLoadingForm(false);
    }

    setForm({
      appointmentId: '',
      patient: '',
      diagnosis: '',
      prescription: '',
      followUp: '',
      aiSummary: '',
    });
    setAiSummary('');
    setLoadingForm(false);
  };

  const generateAISummary = async () => {
    setLoading(true);
    if (!form.diagnosis) {
      setAiSummary('Please write a diagnosis first.');
      setLoading(false);
      return;
    }

    try {
      const response = await doctorGenerateAISummary({
        diagnosis: form.diagnosis,
        doctorName: user.name,
      });

      toast.success('Generated Ai Summary successfully');

      setForm((prev) => ({ ...prev, aiSummary: response.summary }));
      setAiSummary(response.summary);
      setLoading(false);
    } catch (error) {
      toast.error('Error generating AI summary');
      console.error('Error generating AI summary:', error);
      setLoading(false);
    }
  };

  return (
    <div className='space-y-8'>
      {/* ---------- Header ---------- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className='text-2xl font-semibold flex items-center gap-2'>
          <FileText className='text-emerald-400' /> Case Records
        </h1>
        <p className='text-sm text-gray-400'>
          Create and manage patient medical history
        </p>
      </motion.div>

      {/* ---------- Case Record Form ---------- */}
      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl space-y-5'>
        <form
          onSubmit={handleSave}
          className='grid md:grid-cols-2 gap-5 text-sm'
        >
          {/* Patient */}
          <div className='md:col-span-2'>
            <label className='text-gray-400 flex items-center gap-2'>
              <UserRound size={16} /> Select Patient
            </label>
            <select
              name='patient'
              value={form.appointmentId}
              onChange={handleChange}
              className='w-full mt-1 bg-[#0a0f0a] border border-emerald-500/20 p-3 rounded-xl text-white'
            >
              <option value=''>-- Choose Patient --</option>
              {patients.map((p, i) => (
                <option
                  key={i}
                  value={p._id}
                >
                  {p?.patient?.name}
                </option>
              ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div className='md:col-span-2'>
            <label className='text-gray-400 flex items-center gap-2'>
              <Stethoscope size={16} /> Diagnosis
            </label>
            <Textarea
              name='diagnosis'
              value={form.diagnosis}
              onChange={handleChange}
              placeholder='Enter diagnosis details...'
              rows={3}
              className='mt-1 bg-[#0a0f0a] border border-emerald-500/20 text-white'
            />
          </div>

          {/* Prescription */}
          <div className='md:col-span-2'>
            <label className='text-gray-400 flex items-center gap-2'>
              <FileText size={16} /> Prescription
            </label>
            <Textarea
              name='prescription'
              value={form.prescription}
              onChange={handleChange}
              placeholder='Write prescribed medicines or advice...'
              rows={3}
              className='mt-1 bg-[#0a0f0a] border border-emerald-500/20 text-white'
            />
          </div>

          {/* Follow Up */}
          <div className='md:col-span-2'>
            <label className='text-gray-400'>Follow-up Date / Notes</label>
            <Input
              type='text'
              name='followUp'
              value={form.followUp}
              onChange={handleChange}
              placeholder='e.g. 1 week later or 2025-11-10'
              className='bg-[#0a0f0a] border border-emerald-500/20 text-white'
            />
          </div>

          {/* Buttons */}
          <div className='md:col-span-2 flex gap-3'>
            <Button
              type='button'
              onClick={generateAISummary}
              className='bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            >
              <Brain
                size={15}
                className='mr-2'
              />
              {loading ? (
                <LoaderCircle className='white h-24 w-24 animate-spin' />
              ) : (
                'Generate AI Summary'
              )}
            </Button>

            <Button
              type='submit'
              className='bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
            >
              {loadingForm === true ? (
                <LoaderCircle className='white h-24 w-24 animate-spin' />
              ) : (
                'Save Record'
              )}
            </Button>
          </div>
        </form>

        {/* ---------- AI Summary ---------- */}
        {aiSummary && (
          <div className='p-4 bg-[#0c120e] border border-emerald-500/20 rounded-xl text-sm text-gray-300 mt-2'>
            <strong className='text-emerald-400'>AI Suggestion:</strong>{' '}
            {aiSummary}
          </div>
        )}
      </Card>

      {/* ---------- Case History Table ---------- */}
      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl'>
        <h2 className='text-lg font-semibold mb-4 text-white'>
          Recent Case History
        </h2>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead className='text-gray-400 border-b border-emerald-500/10'>
              <tr>
                <th className='py-2 text-left'>Patient</th>
                <th className='text-left'>Diagnosis</th>
                <th className='text-left'>Prescription</th>
                <th className='text-left'>Follow-up</th>
                <th className='text-left'>Date</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const patientName =
                  typeof r.patient === 'object' ? r.patient?.name : r.patient;
                return (
                  <tr
                    key={i}
                    className='border-b border-emerald-500/5 hover:bg-white/5 transition-all'
                  >
                    <td className='py-2 text-white'>{patientName}</td>
                    <td className='text-gray-400'>{r.diagnosis}</td>
                    <td className='text-gray-400'>{r.prescription}</td>
                    <td className='text-gray-400'>{r.followUp}</td>
                    <td className='text-gray-400'>{r.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DoctorCaseRecords;
