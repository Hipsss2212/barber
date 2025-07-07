import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createZaloPayPayment } from '../stores/slices/zalopaySlice';
import { toast } from 'react-toastify';

const useZaloPayService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePaymentResult = useCallback((queryParams) => {
        const status = queryParams.get('status');
        const transactionId = queryParams.get('transactionId');
        const amount = queryParams.get('amount');

        if (status === 'success') {
            toast.success(`Thanh toán thành công ${parseInt(amount).toLocaleString()}₫`);
            navigate('/payment-return', {
                state: {
                    amount: parseInt(amount),
                    transactionId
                }
            });
        } else {
            navigate('/booking-failure', {
                state: {
                    errorCode: 'ZALO_PAY_FAILED',
                    message: 'Thanh toán thất bại'
                }
            });
        }
    }, [navigate]);

    const initiatePayment = useCallback(async (amount, bookingId) => {
        try {
            const description = `Payment for booking #${bookingId}`;
            const orderReferenceId = bookingId.toString(); // bạn có thể customize theo hệ thống của bạn

            const result = await dispatch(createZaloPayPayment({
                amount,
                description,
                orderReferenceId
            })).unwrap();

            console.log(result);

            if (result && result.order_url) {
                window.location.href = result.order_url;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error) {
            console.log(error);

            // toast.error(error.message || 'Lỗi khởi tạo thanh toán');
            throw error;
        }
    }, [dispatch]);

    return {
        handlePaymentResult,
        initiatePayment
    };
};

export default useZaloPayService;
