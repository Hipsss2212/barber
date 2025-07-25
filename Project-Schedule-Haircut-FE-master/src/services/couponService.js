import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  blockCoupon,
  unblockCoupon,
  clearCouponError
} from '../stores/slices/couponSlice';
import { message } from 'antd';

const useCouponService = () => {
  const dispatch = useDispatch();
  const couponState = useSelector((state) => state.coupon);

  const getCoupons = async () => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(fetchCoupons());
      if (fetchCoupons.fulfilled.match(resultAction)) {
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Lỗi tải danh sách coupon');
      }
    } catch (error) {
      throw error;
    }
  };

  const createNewCoupon = async (coupon) => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(createCoupon(coupon));
      if (createCoupon.fulfilled.match(resultAction)) {
        message.success('Thêm coupon thành công');
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Thêm coupon thất bại');
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    }
  };

  const updateExistingCoupon = async (id, coupon) => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(updateCoupon({ id, coupon }));
      if (updateCoupon.fulfilled.match(resultAction)) {
        message.success('Cập nhật coupon thành công');
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Cập nhật coupon thất bại');
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    }
  };

  const deleteCouponAction = async (id) => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(deleteCoupon(id));
      if (deleteCoupon.fulfilled.match(resultAction)) {
        message.success('Xóa coupon thành công');
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Xóa coupon thất bại');
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    }
  };

  const blockCouponAction = async (id) => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(blockCoupon(id));
      if (blockCoupon.fulfilled.match(resultAction)) {
        message.success('Đã khóa coupon');
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Khóa coupon thất bại');
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    }
  };

  const unblockCouponAction = async (id) => {
    try {
      dispatch(clearCouponError());
      const resultAction = await dispatch(unblockCoupon(id));
      if (unblockCoupon.fulfilled.match(resultAction)) {
        message.success('Đã mở khóa coupon');
        return resultAction.payload;
      } else {
        throw new Error(resultAction.payload || 'Mở khóa coupon thất bại');
      }
    } catch (error) {
      message.error(error.message);
      throw error;
    }
  };

  return {
    getCoupons,
    createNewCoupon,
    updateExistingCoupon,
    deleteCouponAction,
    blockCouponAction,
    unblockCouponAction,
    couponState,
  };
};

export default useCouponService; 