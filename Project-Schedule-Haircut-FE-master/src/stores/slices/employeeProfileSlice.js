import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchEmployeeProfile = createAsyncThunk(
    'employeeProfile/fetchEmployeeProfile',
    async (username, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/employee/info?username=${username}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateEmployeeProfile = createAsyncThunk(
    'employeeProfile/updateEmployeeProfile',
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put('/employee/update-profile', employeeData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const employeeProfileSlice = createSlice({
    name: 'employeeProfile',
    initialState: {
        profile: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearEmployeeProfileError: (state) => {
            state.error = null;
        },
        clearEmployeeProfile: (state) => {
            state.profile = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEmployeeProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchEmployeeProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateEmployeeProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployeeProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = { ...state.profile, ...action.payload };
            })
            .addCase(updateEmployeeProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearEmployeeProfileError, clearEmployeeProfile } = employeeProfileSlice.actions;
export default employeeProfileSlice.reducer; 