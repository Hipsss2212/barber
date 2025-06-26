// src/stores/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/customer/booking', orderData);
            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message || error.message || 'Đặt lịch thất bại'
            );
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put('/customer/cancel-order', {
                orderId,
                status
            });
            console.log(response);

            return response;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                error.message ||
                'Huỷ lịch thất bại'
            );
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        loading: false,
        error: null,
        successMessage: null,
    },
    reducers: {
        clearOrderState: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            .addCase(cancelOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.successMessage = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = action.payload;
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;
