import API from '../axios';

export async function getDashboardOverview() {
  try {
    const response = await API.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || 'Failed to fetch dashboard overview',
    };
  }
}
