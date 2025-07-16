import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmployeeProfile,
    updateEmployeeProfile,
    clearEmployeeProfileError
} from '../stores/slices/employeeProfileSlice';
import { toast } from 'react-toastify';

const useEmployeeProfileService = () => {
    const dispatch = useDispatch();
    const profileSelector = useSelector((state) => state.employeeProfile);
    const getProfile = async (username) => {
        try {
            dispatch(clearEmployeeProfileError());
            const resultAction = await dispatch(fetchEmployeeProfile(username));
            if (fetchEmployeeProfile.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Lấy thông tin thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi lấy thông tin nhân viên');
            throw error;
        }
    };
    const updateProfileService = async (employeeData) => {
        try {
            dispatch(clearEmployeeProfileError());
            const resultAction = await dispatch(updateEmployeeProfile(employeeData));
            if (updateEmployeeProfile.fulfilled.match(resultAction)) {
                toast.success('Cập nhật hồ sơ thành công');
                return resultAction.payload;
            } else {
                throw new Error(resultAction.payload?.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi cập nhật thông tin nhân viên');
            throw error;
        }
    };
    return {
        getProfile,
        profileSelector,
        updateProfileService
    };
};

export default useEmployeeProfileService; 