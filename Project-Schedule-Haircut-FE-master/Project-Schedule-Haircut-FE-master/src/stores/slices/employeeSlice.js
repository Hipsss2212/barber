import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchAllEmployees = createAsyncThunk(
    'employees/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/web/findAllEmployee');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const employeeSlice = createSlice({
    name: 'employees',
    initialState: {
        employees: [],
        loading: false,
        error: null
    },
    reducers: {
        clearEmployeeError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(fetchAllEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearEmployeeError } = employeeSlice.actions;

export default employeeSlice.reducer;