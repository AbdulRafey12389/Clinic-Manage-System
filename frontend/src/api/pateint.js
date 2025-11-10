// src/api/patient.js
import API from './axios';

export async function getPatientOverview() {
  try {
    const response = await API.get('/patient/dashboard');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function getAvailableDoctors() {
  try {
    const response = await API.get('/patient/available-doctor');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function getAvailableRoom() {
  try {
    const response = await API.get('/patient/available-room');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}
export async function bookAppoitment(formData) {
  try {
    const response = await API.post('/patient/book-appointment', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function getMyAppointment() {
  try {
    const response = await API.get('/patient/my-appointment');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function getMyCaseHistory() {
  try {
    const response = await API.get('/patient/get-caseHistory');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function downloadCaseHistoryPdf(id) {
  try {
    const response = await API.get(`/patient/download-pdf/${id}`, {
      responseType: 'blob', // important!
    });
    return response;
  } catch (error) {
    console.error('Download PDF API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to download PDF');
  }
}

export async function updateProfile(formData) {
  try {
    const response = await API.post(`/patient/update-profile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Download PDF API error:', error);
    throw new Error(error.response?.data?.message || 'Failed to download PDF');
  }
}
