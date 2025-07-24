// src/services/authService.js
import { useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction, clearError, register as registerAction, clearAuth } from '../stores/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useAuthService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const login = async (credentials) => {
        try {
            dispatch(clearError());
            const resultAction = await dispatch(loginAction(credentials));

            if (loginAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorData = resultAction.payload;
                const errorMsg = typeof errorData === 'string'
                    ? errorData
                    : errorData?.message || 'Đăng nhập thất bại';
                
                if (errorMsg.includes('chưa được xác thực')) {
                    toast.error(errorMsg);
                    navigate('/verify-email');
                    return;
                }
                
                // Xử lý lỗi 409 Conflict
                if (errorData?.status === 409) {
                    throw new Error('Tài khoản đã đăng nhập ở thiết bị khác. Vui lòng đăng xuất trước khi đăng nhập lại.');
                }
                
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Auth service error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const resultAction = await dispatch(logoutAction());
            if (logoutAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorData = resultAction.payload;
                const errorMsg = typeof errorData === 'string'
                    ? errorData
                    : errorData?.message || 'Đăng xuất thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const resultAction = await dispatch(registerAction(userData));
            if (registerAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorData = resultAction.payload;
                const errorMsg = typeof errorData === 'string'
                    ? errorData
                    : errorData?.message || 'Đăng ký thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    return {
        login,
        logout,
        register
    };
};

export default useAuthService;