import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Camera, UserRound } from 'lucide-react';
import { updateProfile } from '@/api/pateint';
import { toast } from 'sonner';

export default function ProfilePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: 'Abdul Rafey',
    email: 'rafey@example.com',
    age: 24,
    gender: 'male',
    imageUrl: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const Data = new FormData();
    Data.append('name', formData.name);
    Data.append('email', formData.email);
    Data.append('age', formData.age);
    Data.append('gender', formData.gender);
    if (image) Data.append('image', image);

    const res = await updateProfile(Data);
    if (res.status === 200) {
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success(res.data.message);
    } else {
      toast.error('Cannot update your profile');
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='max-w-3xl mx-auto space-y-8'
    >
      <h1 className='text-2xl font-semibold text-white'>My Profile</h1>

      <Card className='p-6 rounded-2xl bg-[#101614] border border-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.05)]'>
        <form
          onSubmit={handleSubmit}
          className='space-y-6'
        >
          {/* Profile Image */}
          <div className='flex flex-col items-center gap-3'>
            <div className='relative'>
              {preview || user.imageUrl ? (
                <img
                  src={preview ? preview : user.imageUrl}
                  alt='Profile'
                  className='w-28 h-28 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg'
                />
              ) : (
                <div className='w-28 h-28 rounded-full flex items-center justify-center bg-[#0b0f0e] border border-emerald-500/20'>
                  <UserRound className='text-emerald-400 w-8 h-8' />
                </div>
              )}

              <label
                htmlFor='image-upload'
                className='absolute bottom-0 right-1 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full cursor-pointer transition-colors'
              >
                <Camera size={16} />
              </label>
              <input
                id='image-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={handleImage}
              />
            </div>
            <p className='text-sm text-gray-400'>Upload your profile picture</p>
          </div>

          {/* Form Fields */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div>
              <Label
                htmlFor='name'
                className='text-gray-400'
              >
                Full Name
              </Label>
              <Input
                id='name'
                name='name'
                value={user.name}
                onChange={handleChange}
                className='bg-[#0b0f0e] border border-emerald-500/10 text-white'
              />
            </div>

            <div>
              <Label
                htmlFor='email'
                className='text-gray-400'
              >
                Email
              </Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={user.email}
                onChange={handleChange}
                className='bg-[#0b0f0e] border border-emerald-500/10 text-white'
              />
            </div>

            <div>
              <Label
                htmlFor='age'
                className='text-gray-400'
              >
                Age
              </Label>
              <Input
                id='age'
                name='age'
                type='number'
                value={user.age}
                onChange={handleChange}
                className='bg-[#0b0f0e] border border-emerald-500/10 text-white'
              />
            </div>

            <div>
              <Label
                htmlFor='gender'
                className='text-gray-400'
              >
                Gender
              </Label>
              <select
                id='gender'
                name='gender'
                value={user.gender}
                onChange={handleChange}
                className='w-full rounded-md p-3 bg-[#0b0f0e] border border-emerald-500/10 text-white focus:ring-emerald-500 focus:border-emerald-500'
              >
                <option>male</option>
                <option>female</option>
                <option>other</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className='flex gap-3 pt-4'>
            <Button
              type='submit'
              className='bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 py-2 transition-all'
            >
              Save Changes
            </Button>
            <Button
              type='button'
              variant='outline'
              className='border border-emerald-500/20 text-gray-300 hover:bg-[#0b0f0e]'
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
