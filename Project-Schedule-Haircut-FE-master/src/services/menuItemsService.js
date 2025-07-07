import { useDispatch } from 'react-redux';
import {
    fetchServicesAndCombos,
    clearMenuItemsError,
} from '../stores/slices/menuItemsSlice';
import { toast } from 'react-toastify';

const useMenuItemsService = () => {
    const dispatch = useDispatch();

    const getServicesAndCombos = async (categoryId) => {
        try {
            dispatch(clearMenuItemsError());
            const resultAction = await dispatch(fetchServicesAndCombos(categoryId));

            if (fetchServicesAndCombos.fulfilled.match(resultAction)) {
                return {
                    services: resultAction.payload.serviceDTOS || [],
                    combos: resultAction.payload.comboDTOS || []
                };
            } else {
                const errorMsg = resultAction.payload?.response?.data?.message
                    || resultAction.payload?.message
                    || 'Có lỗi xảy ra!';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message || 'Lấy dữ liệu không thành công!');
            throw error;
        }
    };

    return {
        getServicesAndCombos,
    };
};

export default useMenuItemsService;