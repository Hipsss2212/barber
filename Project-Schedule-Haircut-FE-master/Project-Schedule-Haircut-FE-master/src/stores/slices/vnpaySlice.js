import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createVnPayPayment = createAsyncThunk(
    'vnpay/createPayment',
    async ({ amount, orderInfo }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/vnpay/create', {
                params: {
                    amount: amount * 100, // Convert to VND
                    orderInfo
                }
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    paymentUrl: null,
    isLoading: false,
    error: null,
    paymentData: null
};

const vnpaySlice = createSlice({
    name: 'vnpay',
    initialState,
    reducers: {
        resetVnPayState: () => initialState,
        setPaymentStatus: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createVnPayPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createVnPayPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentUrl = action.payload.data;
                state.paymentData = action.payload;
            })
            .addCase(createVnPayPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { resetVnPayState, setPaymentStatus } = vnpaySlice.actions;
export default vnpaySlice.reducer;