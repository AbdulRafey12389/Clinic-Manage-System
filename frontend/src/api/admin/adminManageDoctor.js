import API from '../axios';

export async function addDoctor(formData) {
  try {
    const response = await API.post('/admin/create-doctor', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add doctor',
    };
  }
}

// ✅ Get all doctors
export async function getAllDoctors() {
  try {
    const response = await API.get('admin/get-doctor');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch doctors',
    };
  }
}

export async function editDoctor(id, updates) {
  try {
    const response = await API.put(`/admin/edit-doctor/${id}`, updates);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update doctor',
    };
  }
}

// ✅ Delete doctor
export async function deleteDoctor(id) {
  try {
    const response = await API.delete(`/admin/delete-doctor/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete doctor',
    };
  }
}
