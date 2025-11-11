import React, { useEffect, useState } from 'react';
import { LogIn, Mail, Lock, UserRound, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useActionData, Form, useNavigation } from 'react-router-dom';
import { toast } from 'sonner';

const Login = () => {
  const actionData = useActionData();
  const [role, setRole] = useState('');
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
              <LogIn className='h-8 w-8 text-primary' />
            </motion.div>
            <CardTitle className='text-2xl font-semibold tracking-tight text-foreground'>
              Welcome Back 🩺
            </CardTitle>
            <p className='text-muted-foreground text-sm'>
              Login to continue your journey
            </p>
          </CardHeader>

          <CardContent>
            <Form
              method='POST'
              action='/login'
              className='space-y-5'
            >
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
                    type='password'
                    name='password'
                    placeholder='••••••••'
                    className='pl-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label className='text-sm text-muted-foreground flex items-center gap-1'>
                  <UserRound className='h-4 w-4' /> Select Role
                </Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                >
                  <SelectTrigger className='bg-background/60 border-border/40'>
                    <SelectValue placeholder='Choose a role' />
                  </SelectTrigger>
                  <SelectContent className='dark:bg-[#1b1b1b]'>
                    <SelectItem value='patient'>Patient</SelectItem>
                    <SelectItem value='doctor'>Doctor</SelectItem>
                    <SelectItem value='admin'>Admin</SelectItem>
                  </SelectContent>
                  <Input
                    type='hidden'
                    name='role'
                    value={role}
                    placeholder='Enter your email'
                    className='pl-9 bg-background/60 border-border/40 focus-visible:ring-primary'
                    required
                  />
                </Select>
              </div>

              <Button
                type='submit'
                className='w-full py-2 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-colors'
                disabled={navigation.state !== 'idle'}
              >
                {navigation.state !== 'idle' ? (
                  <LoaderCircle className='white h-24 w-24 animate-spin' />
                ) : (
                  'Login'
                )}
              </Button>

              <p className='text-center text-sm text-muted-foreground'>
                Don’t have an account?{' '}
                <a
                  href='/register'
                  className='text-primary hover:underline'
                >
                  Register
                </a>
              </p>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
