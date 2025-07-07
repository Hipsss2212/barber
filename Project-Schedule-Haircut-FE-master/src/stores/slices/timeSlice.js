// src/stores/slices/timeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchTimes = createAsyncThunk(
    'time/fetchTimes',
    async ({ employeeId, date }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/customer/time/${employeeId}`, {
                params: { date },
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const timeSlice = createSlice({
    name: 'time',
    initialState: {
        times: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTimeError: (state) => {
            state.error = null;
        },
        resetTimes: (state) => {
            state.times = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTimes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTimes.fulfilled, (state, action) => {
                state.loading = false;
                state.times = action.payload;
            })
            .addCase(fetchTimes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });


    },
});

export const { clearTimeError, resetTimes } = timeSlice.actions;
export default timeSlice.reducer;
