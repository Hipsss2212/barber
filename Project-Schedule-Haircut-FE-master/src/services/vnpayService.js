// services/vnpayService.js
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createVnPayPayment } from '../stores/slices/vnpaySlice';
import { toast } from 'react-toastify';

const useVnPayService = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePaymentResult = useCallback((queryParams) => {
        const status = queryParams.get('status');
        const amount = queryParams.get('vnp_Amount');
        const responseCode = queryParams.get('vnp_ResponseCode');
        const transactionId = queryParams.get('vnp_TransactionNo');

        if (status === 'success' && responseCode === '00') {
            toast.success(`Thanh toán thành công ${(amount / 100).toLocaleString()}₫`);
            navigate('/payment-return', {
                state: {
                    amount: amount / 100,
                    transactionId
                }
            });
        } else {
            navigate('/booking-failure', {
                state: {
                    errorCode: responseCode,
                    message: 'Thanh toán thất bại'
                }
            });
        }
    }, [navigate]);


    const initiatePayment = useCallback(async (amount, bookingId) => {
        try {
            const orderInfo = `Thanh toán cho đơn hàng #${bookingId}`;
            const result = await dispatch(createVnPayPayment({
                amount: amount,
                orderInfo
            })).unwrap();

            if (result) {
                window.location.href = result;
            } else {
                throw new Error('Không nhận được URL thanh toán');
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    }, [dispatch]);

    return {
        handlePaymentResult,
        initiatePayment
    };
};

export default useVnPayService;