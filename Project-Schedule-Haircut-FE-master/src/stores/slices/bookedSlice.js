import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchBookedStatus0 = createAsyncThunk(
    'booked/fetchStatus0',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/show-ordered-0');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBookedStatus1 = createAsyncThunk(
    'booked/fetchStatus1',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/show-ordered-1');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchBookedStatus2 = createAsyncThunk(
    'booked/fetchStatus2',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/show-ordered-2');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const bookedSlice = createSlice({
    name: 'booked',
    initialState: {
        status0: [],
        status1: [],
        status2: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearBookedError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookedStatus0.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedStatus0.fulfilled, (state, action) => {
                state.loading = false;
                state.status0 = action.payload;
            })
            .addCase(fetchBookedStatus0.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBookedStatus1.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedStatus1.fulfilled, (state, action) => {
                state.loading = false;
                state.status1 = action.payload;
            })
            .addCase(fetchBookedStatus1.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBookedStatus2.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookedStatus2.fulfilled, (state, action) => {
                state.loading = false;
                state.status2 = action.payload;
            })
            .addCase(fetchBookedStatus2.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBookedError } = bookedSlice.actions;

export default bookedSlice.reducer;
