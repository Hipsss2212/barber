import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

// Async thunks
export const fetchCoupons = createAsyncThunk('coupon/fetchCoupons', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get('/api/coupons');
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createCoupon = createAsyncThunk('coupon/createCoupon', async (coupon, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post('/api/coupons', coupon);
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateCoupon = createAsyncThunk('coupon/updateCoupon', async ({ id, coupon }, { rejectWithValue }) => {
  try {
    const res = await axiosClient.put(`/api/coupons/${id}`, coupon);
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteCoupon = createAsyncThunk('coupon/deleteCoupon', async (id, { rejectWithValue }) => {
  try {
    await axiosClient.delete(`/api/coupons/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const blockCoupon = createAsyncThunk('coupon/blockCoupon', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/api/coupons/${id}/block`);
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const unblockCoupon = createAsyncThunk('coupon/unblockCoupon', async (id, { rejectWithValue }) => {
  try {
    const res = await axiosClient.patch(`/api/coupons/${id}/unblock`);
    return res.data || res;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    coupons: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCouponError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons.push(action.payload);
      })
      .addCase(createCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.coupons.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.coupons[idx] = action.payload;
      })
      .addCase(updateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = state.coupons.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockCoupon.fulfilled, (state, action) => {
        const idx = state.coupons.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.coupons[idx].is_blocked = true;
      })
      .addCase(unblockCoupon.fulfilled, (state, action) => {
        const idx = state.coupons.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.coupons[idx].is_blocked = false;
      });
  },
});

export const { clearCouponError } = couponSlice.actions;
export default couponSlice.reducer; 