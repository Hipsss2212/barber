// src/stores/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (username, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/customer/info?username=${username}`);

            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put('/customer/update-profile', customerData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        clearProfile: (state) => {
            state.profile = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = { ...state.profile, ...action.payload };
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearProfileError, clearProfile } = profileSlice.actions;

export default profileSlice.reducer;
