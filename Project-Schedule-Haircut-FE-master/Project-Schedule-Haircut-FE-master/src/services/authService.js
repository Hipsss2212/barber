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
                const errorMsg = errorData?.message || 'Đăng nhập thất bại';
                
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
            dispatch(clearError());
            const resultAction = await dispatch(logoutAction());

            if (logoutAction.fulfilled.match(resultAction)) {
                toast.success('Đăng xuất thành công');
                navigate('/home');
                return true;
            } else {
                // Handle specific error cases
                const errorData = resultAction.payload;
                
                // If it's a 500 error, we'll still log the user out locally
                if (errorData?.status === 500) {
                    console.warn('Backend logout failed with 500 error, logging out locally');
                    toast.warn('Đăng xuất khỏi máy chủ thất bại, nhưng đã đăng xuất khỏi ứng dụng');
                    
                    // Clear local authentication state
                    dispatch(clearAuth());
                    
                    // Clear cookies
                    Cookies.remove('accessToken');
                    Cookies.remove('username');
                    Cookies.remove('role');
                    
                    navigate('/home');
                    return true;
                }
                
                throw new Error(errorData?.message || 'Đăng xuất thất bại');
            }
        } catch (error) {
            console.error('Logout service error:', error);
            
            // Fallback: clear local state even if there's an error
            try {
                dispatch(clearAuth());
                
                // Clear cookies
                Cookies.remove('accessToken');
                Cookies.remove('username');
                Cookies.remove('role');
                
                toast.warn('Đã đăng xuất khỏi ứng dụng');
                navigate('/home');
                return true;
            } catch (fallbackError) {
                console.error('Fallback logout error:', fallbackError);
                throw new Error(error.message || 'Đăng xuất thất bại');
            }
        }
    };

    const register = async (userData) => {
        try {
            dispatch(clearError());
            const result = await dispatch(registerAction(userData)).unwrap();
            toast.success(result || 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.');
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