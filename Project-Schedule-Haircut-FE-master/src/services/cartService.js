import { useDispatch, useSelector } from 'react-redux';
import {
    getCartItems as getCartItemsAction,
    clearCartError,
    removeCartItem,
    addComboToCart,
    addServiceToCart,
    deleteCartItems,
    countCartItems
} from '../stores/slices/cartSlice';

import { toast } from 'react-toastify';

const useCartService = () => {
    const dispatch = useDispatch();
    const { loading, error, itemCount } = useSelector(state => state.cart);

    const handleError = (error, defaultMessage) => {
        const message = error?.message || error || defaultMessage;
        toast.error(message);
        return message;
    };

    const fetchCartItems = async () => {
        try {
            dispatch(clearCartError());
            const result = await dispatch(getCartItemsAction()).unwrap();
            return result;
        } catch (error) {
            handleError(error, 'Lỗi tải giỏ hàng');
            throw error;
        }
    };

    const addCombo = async (comboData) => {
        try {
            dispatch(clearCartError());
            await dispatch(addComboToCart(comboData)).unwrap();
            // toast.success('Thêm combo thành công');
            fetchItemCount();
            return true;
        } catch (error) {
            handleError(error, 'Thêm combo thất bại');
            return false;
        }
    };

    const addService = async (serviceData) => {
        try {
            dispatch(clearCartError());
            await dispatch(addServiceToCart(serviceData)).unwrap();
            // toast.success('Thêm dịch vụ thành công');
            fetchItemCount();
            return true;
        } catch (error) {
            handleError(error, 'Thêm dịch vụ thất bại');
            return false;
        }
    };

    const deleteItems = async (cartItemIds) => {
        try {
            await dispatch(deleteCartItems(cartItemIds)).unwrap();
            toast.success('Xóa thành công');
            return true;
        } catch (error) {
            handleError(error, 'Xóa thất bại');
            return false;
        }
    };

    const fetchItemCount = async () => {
        try {
            dispatch(clearCartError());
            await dispatch(countCartItems()).unwrap();
        } catch (error) {
            handleError(error, 'Lỗi đếm sản phẩm');
        }
    };

    return {
        fetchCartItems,
        addCombo,
        addService,
        deleteItems,
        fetchItemCount,
        itemCount,
        removeItem: (itemId) => dispatch(removeCartItem(itemId)),
        loading,
        error
    };
};

export default useCartService;