import { useDispatch } from 'react-redux';
import {
    fetchBookedStatus0,
    fetchBookedStatus1,
    fetchBookedStatus2,
    clearBookedError
} from '../stores/slices/bookedSlice';
import { toast } from 'react-toastify';

const useBookedService = () => {
    const dispatch = useDispatch();

    const getBookedByStatus = async (status) => {
        try {
            dispatch(clearBookedError());

            let actionToDispatch;

            if (status === 0) actionToDispatch = fetchBookedStatus0;
            else if (status === 1) actionToDispatch = fetchBookedStatus1;
            else if (status === 2) actionToDispatch = fetchBookedStatus2;

            const result = await dispatch(actionToDispatch());

            if (actionToDispatch.fulfilled.match(result)) {
                // Map lại dữ liệu để luôn có couponDiscount và couponCode
                const bookings = result.payload.map(b => ({
                    ...b,
                    couponDiscount: b.couponDiscount ?? b.discount ?? (b.coupon ? b.coupon.discount : 0) ?? 0,
                    couponCode: b.couponCode ?? (b.coupon ? b.coupon.name : '') ?? ''
                }));
                return bookings;
            } else {
                throw result.payload;
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi lấy dữ liệu đặt lịch');
            throw error;
        }
    };

    return { getBookedByStatus };
};

export default useBookedService;
