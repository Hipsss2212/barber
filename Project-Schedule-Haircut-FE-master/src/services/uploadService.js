import axios from 'axios';
import Cookies from 'js-cookie';

// Hàm upload ảnh, trả về link ảnh từ server
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Lấy token từ localStorage, sessionStorage hoặc cookies
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || Cookies.get('token');
    const response = await axios.post('/api/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
    });
    return response.data.url || response.data.link || response.data;
}; 