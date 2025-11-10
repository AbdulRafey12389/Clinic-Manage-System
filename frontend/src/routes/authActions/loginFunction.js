import { redirect } from 'react-router-dom';
import { loginUser } from '@/api/auth';

const signInAction = async function ({ request }) {
  const formdata = await request.formData();

  const email = formdata.get('email');
  const password = formdata.get('password');
  const role = formdata.get('role');

  if (!email || !password || !role) return 'All fields are reuired.';

  const data = Object.fromEntries(formdata.entries());

  try {
    const response = await loginUser(data);
    if (response.success == false) {
      return response.message;
    } else {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);

      if (response.user.role === 'admin') {
        return redirect('/admin/dashboard');
      } else if (response.user.role === 'doctor') {
        return redirect('/doctor/dashboard');
      }
      return redirect('/patient/dashboard');
    }
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export default signInAction;
