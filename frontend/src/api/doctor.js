import API from './axios';

export async function getDoctorAppointments(filter) {
  try {
    const response = await API.get(
      `/doctor/doctor-appointment?status=${filter}`,
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function getDoctorDashboard() {
  try {
    const response = await API.get('/doctor/dashboard');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}
export async function doctorCompletedAppointment() {
  try {
    const response = await API.get('/doctor/doctor-completed-appointment');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function doctorGenerateAISummary(data) {


  try {
    const response = await API.post('/doctor/ai-summary', data);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}
export async function createCasehistory(form) {
  try {
    const response = await API.post('/doctor/create-case-history', form);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}
export async function getDoctorCaseHistories() {
  try {
    const response = await API.get('/doctor/get-case-history');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function updateAppointment(id, status) {
  try {
    const response = await API.post(`/doctor/update-appointment/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}
