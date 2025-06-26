import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const createZaloPayPayment = createAsyncThunk(
    'zalopay/createPayment',
    async ({ amount, description, orderReferenceId }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/customer/zalopay/create', {
                amount,
                description,
                orderReferenceId
            });
            return response.data;
        } catch (error) {
            console.log(error);

            return rejectWithValue(error);
        }
    }
);

const initialState = {
    paymentData: null,
    isLoading: false, // Thay status bằng isLoading
    error: null,
    paymentUrl: null
};

const zalopaySlice = createSlice({
    name: 'zalopay',
    initialState,
    reducers: {
        resetZaloPayState: () => initialState,
        // Bỏ reducer setZaloPayStatus vì không cần nữa
    },
    extraReducers: (builder) => {
        builder
            .addCase(createZaloPayPayment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createZaloPayPayment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentData = action.payload;
                state.paymentUrl = action.payload.data;
            })
            .addCase(createZaloPayPayment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { resetZaloPayState } = zalopaySlice.actions;
export default zalopaySlice.reducer;