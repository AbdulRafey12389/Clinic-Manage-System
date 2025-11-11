import React, { useEffect, useState } from 'react';
import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';

import {
  UserPlus,
  Mail,
  Lock,
  UserRound,
  Eye,
  EyeOff,
  LoaderCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const actionData = useActionData();
  const navigation = useNavigation();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (actionData) {
      setError(actionData);
    }
  }, [actionData]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError(null);
    }
  }, [error]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted dark:from-[#0a0a0a] dark:to-[#121212] transition-all'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='w-full max-w-md p-4'
      >
        <Card className='backdrop-blur-xl bg-card/80 border-border/40 shadow-2xl rounded-2xl'>
          <CardHeader className='text-center space-y-2'>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 120 }}
              className='mx-auto bg-primary/10 p-3 rounded-full w-fit'
            >
              <UserPlus className='h-8 w-8 text-primary' />
            </motion.div>
            <CardTitle className='text-2xl font-semibold tracking-tight text-foreground'>
              Create Your Account 🩺
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Join us and manage your clinic smarter
            </p>
          </CardHeader>

          <CardContent>
            <Form
              action='/register'
              method='POST'
              className='space-y-5'
            >
              <div className='space-y-2'>
                <Label
                  htmlFor='fullname'
                  className='text-sm text-muted-foreground'
                >
                  Full Name
                </Label>
                <div className='relative'>
                  <UserRound className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='fullname'
                    type='text'
                    name='name'
                    placeholder='Enter your full name'
                    className='pl-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='email'
                  className='text-sm text-muted-foreground'
                >
                  Email Address
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='email'
                    type='email'
                    name='email'
                    placeholder='Enter your email'
                    className='pl-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm text-muted-foreground'
                >
                  Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Create password'
                    className='pl-9 pr-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition'
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='confirmPassword'
                  className='text-sm text-muted-foreground'
                >
                  Confirm Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
                  <Input
                    id='confirmPassword'
                    type={showConfirm ? 'text' : 'password'}
                    name='confirmPassword'
                    placeholder='Re-enter password'
                    className='pl-9 pr-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowConfirm(!showConfirm)}
                    className='absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition'
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type='submit'
                className='w-full py-2 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors'
                disabled={navigation.state !== 'idle'}
              >
                {navigation.state !== 'idle' ? (
                  <LoaderCircle className='white h-24 w-24 animate-spin' />
                ) : (
                  'Register'
                )}
              </Button>

              <p className='text-center text-sm text-muted-foreground'>
                Already have an account?{' '}
                <a
                  href='/login'
                  className='text-primary hover:underline'
                >
                  Login
                </a>
              </p>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
