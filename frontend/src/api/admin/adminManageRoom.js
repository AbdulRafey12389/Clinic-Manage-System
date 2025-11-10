import API from '../axios';

export async function addRoom(formData) {
  try {
    const response = await API.post('/admin/create-room', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to add room',
    };
  }
}

export async function getAllRooms() {
  try {
    const response = await API.get('/admin/get-room');
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch rooms',
    };
  }
}

export async function editRoom(id, updates) {
  try {
    const response = await API.put(`/admin/edit-room/${id}`, updates);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update room',
    };
  }
}

export async function deleteRoom(id) {
  try {
    const response = await API.delete(`/admin/delete-room/${id}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete room',
    };
  }
}
