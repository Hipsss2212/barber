import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProfile,
    clearProfileError,
    updateProfile
} from '../stores/slices/profileSlice';
import { toast } from 'react-toastify';

const useProfileService = () => {
    const dispatch = useDispatch();
    const profileSelector = useSelector((state) => state.profile);
    const getProfile = async (username) => {
        try {
            dispatch(clearProfileError());
            const resultAction = await dispatch(fetchProfile(username));

            if (fetchProfile.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Lấy thông tin thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi lấy thông tin người dùng');
            throw error;
        }
    };

    const updateProfileService = async (customerData) => {
        try {
            dispatch(clearProfileError());
            const resultAction = await dispatch(updateProfile(customerData));

            if (updateProfile.fulfilled.match(resultAction)) {
                toast.success('Cập nhật hồ sơ thành công');
                return resultAction.payload;
            } else {
                throw new Error(resultAction.payload?.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi cập nhật thông tin người dùng');
            throw error;
        }
    };

    return {
        getProfile,
        profileSelector,
        updateProfileService
    };
};

export default useProfileService;
