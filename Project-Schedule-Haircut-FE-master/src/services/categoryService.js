import { useDispatch } from 'react-redux';
import {
    fetchAllCategories as fetchAllCategoriesAction,
    clearError
} from '../stores/slices/categorySlice';
import { toast } from 'react-toastify';
const useCategoryService = () => {
    const dispatch = useDispatch();
    const getCategories = async () => {
        try {
            dispatch(clearError());
            const resultAction = await dispatch(fetchAllCategoriesAction());

            if (fetchAllCategoriesAction.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                throw resultAction.payload;
            }
        } catch (error) {
            console.log(error);

            toast.error('Lỗi khi tải danh sách danh mục');
            throw error;
        }
    };

    return { getCategories };
};

export default useCategoryService;