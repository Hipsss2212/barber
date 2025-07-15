import { useDispatch, useSelector } from 'react-redux';
import { staffLogin, staffLogout, clearStaffError, fetchBookingStats, fetchHourlyAppointments, fetchPendingConfirmations, cancelAppointment, confirmAppointment as confirmAppointmentThunk } from '../stores/slices/staffSlice';
import { clearAuth } from '../stores/slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const useStaffService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const staffSelector = useSelector((state) => state.staff);

    const login = async (credentials) => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(staffLogin(credentials));

            if (staffLogin.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Đăng nhập nhân viên thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(staffLogout());

            // Đăng xuất authSlice luôn
            dispatch(clearAuth());

            if (staffLogout.fulfilled.match(resultAction)) {
                toast.success('Đăng xuất thành công');
                navigate('/home');
                return true;
            } else {
                // Handle specific error cases
                const errorData = resultAction.payload;
                
                // If it's a 500 error, we'll still log the user out locally
                if (errorData?.status === 500) {
                    console.warn('Backend staff logout failed with 500 error, logging out locally');
                    toast.warn('Đăng xuất khỏi máy chủ thất bại, nhưng đã đăng xuất khỏi ứng dụng');
                    
                    // Clear cookies
                    Cookies.remove('accessToken');
                    Cookies.remove('username');
                    Cookies.remove('role');
                    
                    navigate('/home');
                    return true;
                }
                
                throw new Error(errorData?.message || 'Đăng xuất nhân viên thất bại');
            }
        } catch (error) {
            console.error('Staff logout service error:', error);
            
            // Fallback: clear local state even if there's an error
            try {
                // Clear cookies
                Cookies.remove('accessToken');
                Cookies.remove('username');
                Cookies.remove('role');
                
                toast.warn('Đã đăng xuất khỏi ứng dụng');
                navigate('/home');
                return true;
            } catch (fallbackError) {
                console.error('Fallback staff logout error:', fallbackError);
                throw new Error(error.message || 'Đăng xuất nhân viên thất bại');
            }
        }
    };

    const getStats = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchBookingStats());
            console.log(resultAction);

            if (fetchBookingStats.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy thống kê';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const getHourlyAppointments = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchHourlyAppointments());

            if (fetchHourlyAppointments.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy lịch theo giờ';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const getPendingConfirmations = async () => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(fetchPendingConfirmations());

            if (fetchPendingConfirmations.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.message || 'Lỗi khi lấy danh sách chờ xác nhận';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    // Bổ sung xác nhận hoàn thành
    const confirmAppointment = async (appointmentId, isComplete = false) => {
        try {
            dispatch(clearStaffError());
            const status = isComplete ? 2 : 1;
            const resultAction = await dispatch(
                confirmAppointmentThunk({ appointmentId, status })
            );

            if (confirmAppointmentThunk.fulfilled.match(resultAction)) {
                getPendingConfirmations();
                getStats();
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload || 'Xác nhận lịch hẹn thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    const cancel = async (appointmentId) => {
        try {
            dispatch(clearStaffError());
            const resultAction = await dispatch(cancelAppointment(appointmentId));

            if (cancelAppointment.fulfilled.match(resultAction)) {
                // Tự động refresh data sau khi thành công
                getPendingConfirmations();
                getStats();
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload || 'Hủy lịch hẹn thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            throw error;
        }
    };

    return {
        login,
        logout,
        getStats,
        getHourlyAppointments,
        getPendingConfirmations,
        confirmAppointment,
        cancelAppointment: cancel,
        staffSelector
    };
};

export default useStaffService;
