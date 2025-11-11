import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Search, LoaderCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  addDoctor,
  deleteDoctor,
  editDoctor,
  getAllDoctors,
} from '@/api/admin/adminManageDoctor';
import { toast } from 'sonner';

import { validateDoctorForm } from '@/utils/validateDocForm';

const ManageDoctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    degrees: '',
    bio: '',
    profilePic: '',
    workingDays: '',
    day: '',
    from: '',
    to: '',
    slotDurationMinutes: 30,
    fees: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await getAllDoctors();
        if (response?.doctors) setDoctors(response.doctors);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      }
    })();
  }, []);

  const handleInput = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const errors = validateDoctorForm(form);

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      setLoading(false);
      return;
    }

    try {
      const {
        name,
        email,
        password,
        specialization,
        experience,
        degrees,
        bio,
        profilePic,
        workingDays,
        day,
        from,
        to,
        slotDurationMinutes,
        fees,
      } = form;

      if (
        !name ||
        !email ||
        !password ||
        !specialization ||
        !experience ||
        !degrees ||
        !bio ||
        !workingDays ||
        !day ||
        !from ||
        !to ||
        !fees
      ) {
        toast.error('Please fill all required fields!');
        setLoading(false);
        return;
      }

      const doctorData = {
        name,
        email,
        password,
        specialization,
        experience,
        degrees,
        bio,
        profilePic,
        workingDays: workingDays
          .split(',')
          .map((d) => d.trim())
          .filter(Boolean),
        day,
        from,
        to,
        slotDurationMinutes: Number(slotDurationMinutes),
        fees: Number(fees),
      };

      let response;
      if (editIndex !== null) {
        const updatedList = [...doctors];
        updatedList[editIndex] = { ...doctors[editIndex], ...doctorData };
        setDoctors(updatedList);
        toast.success('Doctor updated successfully!');
        setLoading(false);
      } else {
        response = await addDoctor(doctorData);
        if (!response?.success) {
          toast.error(response?.error || 'Failed to add doctor');
          setLoading(false);
          return;
        }

        const newDoctor = response?.doctor;
        setDoctors((prev) => [...prev, newDoctor]);
        toast.success('Doctor added successfully!');
        setLoading(false);
      }

      setForm({
        name: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        degrees: '',
        bio: '',
        profilePic: '',
        workingDays: '',
        day: '',
        from: '',
        to: '',
        slotDurationMinutes: 30,
        fees: '',
      });
      setEditIndex(null);
      setOpenModal(false);
    } catch (error) {
      console.error('Error adding/updating doctor:', error);
      toast.error('Something went wrong!');
      setOpenModal(false);
    }
  };

  const openEdit = async (index) => {
    const doctor = doctors[index];

    setForm({
      _id: doctor._id._id,
      name: doctor._id.name || '',
      email: doctor._id.email || '',
      specialization: doctor.specialization || '',
      experience: doctor.experience || '',
      degrees: doctor.degrees || '',
      bio: doctor.bio || '',
      profilePic: doctor.profilePic || '',
      workingDays: Array.isArray(doctor.workingDays)
        ? doctor.workingDays.join(', ')
        : doctor.workingDays || '',
      day: doctor.schedule[0].day || '',
      from: doctor.schedule[0].from || '',
      to: doctor.schedule[0].to || '',
      slotDurationMinutes: doctor.slotDurationMinutes || 30,
      fees: doctor.fees || '',
    });
    setEditIndex(index);
    setOpenModal(true);
  };

  const handleEdit = async (doctor) => {
    setLoading(true);
    try {
      const errors = validateDoctorForm(doctor, true);

      if (errors.length > 0) {
        errors.forEach((err) => toast.error(err));
        setLoading(false);
        setLoading(false);
        return;
      }

      const response = await editDoctor(doctor._id, doctor);
      if (response.success == true) {
        const newDoctor = response?.doctor;
        setDoctors((prev) =>
          prev.map((doc) =>
            doc._id._id === newDoctor._id._id ? newDoctor : doc,
          ),
        );
      }
      setLoading(false);

      setOpenModal(false);
      toast.success(response.message);
    } catch (error) {
      toast.error('Error to updating doctor');
      console.error('Error to updating doctor: ', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, index) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      try {
        setDoctors((prev) => prev.filter((_, i) => i !== index));
        toast.success('Doctor deleted successfully!');

        await deleteDoctor(id);
      } catch (error) {
        toast.error('Error to deleting doctor');
        console.error('Error to deleting doctor: ', error);
      }
    }
  };

  const filteredDoctors = useMemo(() => {
    return doctors.filter(
      (d) =>
        d?._id?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, doctors]);

  return (
    <div className='space-y-8'>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className='flex items-center justify-between'
      >
        <h1 className='text-2xl font-semibold text-white flex items-center gap-2'>
          👨‍⚕️ Manage Doctors
        </h1>
        <Button
          onClick={() => {
            setEditIndex(null); // make sure edit mode off
            setForm({
              name: '',
              email: '',
              password: '',
              specialization: '',
              experience: '',
              degrees: '',
              bio: '',
              profilePic: '',
              workingDays: '',
              day: '',
              from: '',
              to: '',
              slotDurationMinutes: 30,
              fees: '',
            });
            setOpenModal(true);
          }}
          className='bg-emerald-500 hover:bg-emerald-600 text-white'
        >
          <Plus className='w-4 h-4 mr-2' /> Add Doctor
        </Button>
      </motion.div>

      <div className='flex items-center gap-2'>
        <div className='relative w-full max-w-md'>
          <Search className='absolute left-3 top-3 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Search doctors by name or specialization...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-9 bg-[#101614] border border-emerald-500/10 text-white placeholder:text-gray-500'
          />
        </div>
      </div>

      <Card className='p-6 bg-[#101614] border border-emerald-500/10 rounded-2xl space-y-4'>
        <h2 className='text-lg font-semibold text-white'>Doctor List</h2>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm text-gray-300'>
            <thead>
              <tr className='text-left border-b border-emerald-500/10'>
                <th className='py-3'>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Experience</th>
                <th>Working Days</th>
                <th>Schedule</th>
                <th>Fees</th>
                <th className='text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.length ? (
                filteredDoctors.map((d, i) => {
                  return (
                    <tr
                      key={i}
                      className='border-b border-emerald-500/5 hover:bg-emerald-500/5'
                    >
                      <td className='py-3'>{d?._id?.name}</td>
                      <td>{d?._id?.email || 'N/A'}</td>
                      <td>{d.specialization || '—'}</td>
                      <td>{d.experience || '—'}</td>
                      <td>
                        {Array.isArray(d.workingDays)
                          ? d.workingDays.join(', ')
                          : d.workingDays || '—'}
                      </td>
                      <td>
                        {d.schedule?.length
                          ? d.schedule.map(
                              (slot, idx) =>
                                `${slot.day} (${slot.from} - ${slot.to})${
                                  idx < d.schedule.length - 1 ? ', ' : ''
                                }`,
                            )
                          : `${d.day || '—'} (${d.from || '—'} - ${d.to || '—'})`}
                      </td>
                      <td>{d.fees || 0}</td>
                      <td className='flex justify-end gap-2 py-2'>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                          onClick={() => openEdit(i)}
                        >
                          <Edit className='w-4 h-4' />
                        </Button>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-red-500/30 text-red-400 hover:bg-red-500/10'
                          onClick={() => handleDelete(d?._id._id, i)}
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan='8'
                    className='text-center py-5 text-gray-500'
                  >
                    No doctors found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Dialog
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <DialogContent className='bg-[#101614] border border-emerald-500/10 text-white max-w-3xl'>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? 'Edit Doctor' : 'Add New Doctor'}
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className='grid grid-cols-2 gap-4 mt-4'
          >
            <Input
              name='name'
              placeholder='Full Name'
              value={form.name}
              onChange={handleInput}
            />
            <Input
              name='email'
              placeholder='Email'
              value={form.email}
              onChange={handleInput}
            />

            {editIndex === null && (
              <Input
                name='password'
                type='password'
                placeholder='Password'
                value={form.password}
                onChange={handleInput}
              />
            )}

            <Input
              name='specialization'
              placeholder='Specialization'
              value={form.specialization}
              onChange={handleInput}
            />
            <Input
              name='experience'
              placeholder='Experience (e.g., 5 years)'
              value={form.experience}
              onChange={handleInput}
            />
            <Input
              name='degrees'
              placeholder='Degrees (e.g., MBBS, FCPS)'
              value={form.degrees}
              onChange={handleInput}
            />
            <Input
              name='bio'
              placeholder='Short Bio'
              value={form.bio}
              onChange={handleInput}
            />
            <Input
              name='workingDays'
              placeholder='Working Days (comma separated)'
              value={form.workingDays}
              onChange={handleInput}
            />
            <Input
              name='day'
              placeholder='Schedule Day (e.g., Monday)'
              value={form.day}
              onChange={handleInput}
            />
            <Input
              name='from'
              placeholder='From Time (e.g., 09:00 AM)'
              value={form.from}
              onChange={handleInput}
            />
            <Input
              name='to'
              placeholder='To Time (e.g., 05:00 PM)'
              value={form.to}
              onChange={handleInput}
            />
            <Input
              name='slotDurationMinutes'
              type='number'
              placeholder='Slot Duration (minutes)'
              value={form.slotDurationMinutes}
              onChange={handleInput}
            />
            <Input
              name='fees'
              type='number'
              placeholder='Consultation Fee'
              value={form.fees}
              onChange={handleInput}
            />
          </form>

          <DialogFooter className='mt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpenModal(false)}
              className='border-gray-600 text-gray-400 hover:bg-gray-800'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={
                editIndex !== null ? () => handleEdit(form) : handleSubmit
              }
              className='bg-emerald-500 hover:bg-emerald-600 text-white'
              disabled={loading}
            >
              {' '}
              {loading === true ? (
                <LoaderCircle className='white h-24 w-24 animate-spin' />
              ) : (
                `${editIndex !== null ? 'Update' : 'Create'}`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageDoctors;
