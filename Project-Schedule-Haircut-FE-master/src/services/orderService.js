// src/services/orderService.js
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, clearOrderState, cancelOrder as cancelOrderAction } from '../stores/slices/orderSlice';
import { toast } from 'react-toastify';

const useOrderService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const order = async (orderData) => {
        try {
            dispatch(clearOrderState());
            const resultAction = await dispatch(createOrder(orderData));

            if (createOrder.fulfilled.match(resultAction)) {
                toast.success(resultAction.payload);

                navigate('/home');
            } else {
                const errorMsg =
                    resultAction.payload ||
                    'Đặt lịch thất bại, vui lòng thử lại.';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.log(error);

            toast.error(error.message);
            throw error;
        }
    };

    const cancelOrder = async (orderId, status) => {
        try {
            dispatch(clearOrderState());
            console.log(orderId, status);

            const resultAction = await dispatch(
                cancelOrderAction({ orderId, status })
            );

            if (cancelOrderAction.fulfilled.match(resultAction)) {
                toast.success("Huỷ lịch thành công");
                return true;
            } else {
                const errorMsg = resultAction.payload || 'Huỷ lịch thất bại';
                throw new Error(errorMsg);
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    return { order, cancelOrder };
};

export default useOrderService;
