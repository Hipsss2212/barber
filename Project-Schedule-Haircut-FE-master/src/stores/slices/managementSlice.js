import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

// Async thunks
export const fetchAccounts = createAsyncThunk(
    'management/fetchAccounts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/accounts');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchServices = createAsyncThunk(
    'management/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/services');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchCombos = createAsyncThunk(
    'management/fetchCombos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/combos');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createEmployee = createAsyncThunk(
    'management/createEmployee',
    async (employeeData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/admin/create', employeeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'management/updateEmployee',
    async ({ id, employeeData }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/admin/updated/${id}`, employeeData);
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const changeBlock = createAsyncThunk(
    'management/changeBlock',
    async ({ id, isBlocked }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/admin/change-block/${id}`, null, {
                params: { isBlocked }
            });
            return { id, isBlocked };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchAllTimes = createAsyncThunk(
    'management/fetchTimes',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/admin/times');
            console.log(response);

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addTimeForEmployee = createAsyncThunk(
    'management/addTimeForEmployee',
    async ({ timeId, employeeId }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/admin/addTime', {
                timeId, employeeId
            });
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const removeTimeFromEmployee = createAsyncThunk(
    'management/removeTimeFromEmployee',
    async ({ timeId, employeeId }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete('/admin/removeTime', {
                data: { timeId, employeeId }
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createService = createAsyncThunk(
    'management/createService',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/admin/create-service', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateService = createAsyncThunk(
    'management/updateService',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/admin/services/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteService = createAsyncThunk(
    'management/deleteService',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/admin/services/${id}`);
            return { id };
        } catch (error) {
            // Lấy message từ backend nếu có, nếu không thì lấy error.message
            const message = error.response?.data?.message || error.message || 'Lỗi không xác định';
            return rejectWithValue(message);
        }
    }
);

export const createCombo = createAsyncThunk(
    'management/createCombo',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/admin/create-combo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateCombo = createAsyncThunk(
    'management/updateCombo',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await axiosClient.put(`/admin/combos/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCombo = createAsyncThunk(
    'management/deleteCombo',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete(`/admin/combos/${id}`);
            return { id };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


const initialState = {
    accounts: [],
    services: [],
    combos: [],
    times: [],
    loading: false,
    error: null
};

const managementSlice = createSlice({
    name: 'management',
    initialState,
    reducers: {
        clearManagementError: (state) => {
            state.error = null;
        },
        resetManagementState: () => initialState,
        updateEmployeeLocally: (state, action) => {
            const updatedEmployee = action.payload;
            state.accounts = state.accounts.map(account =>
                account.id === updatedEmployee.id ? updatedEmployee : account
            );
        }
    },
    extraReducers: (builder) => {
        builder
            // Accounts
            .addCase(fetchAccounts.fulfilled, (state, action) => {
                state.loading = false;
                state.accounts = action.payload;
            })

            // Services
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload;
            })

            // Combos
            .addCase(fetchCombos.fulfilled, (state, action) => {
                state.loading = false;
                state.combos = action.payload;
            })

            // Create Employee
            .addCase(createEmployee.fulfilled, (state) => {
                state.loading = false;
            })

            // Update Employee
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
            })

            // Change Block
            .addCase(changeBlock.fulfilled, (state, action) => {
                const { id, isBlocked } = action.payload;
                const accountIndex = state.accounts.findIndex(account => account.id === id);
                if (accountIndex !== -1) {
                    state.accounts[accountIndex].isBlocked = isBlocked;
                }
                state.loading = false;
            })

            // Fetch All Times
            .addCase(fetchAllTimes.fulfilled, (state, action) => {
                state.loading = false;
                state.times = action.payload;
            })

            // Add Time for Employee
            .addCase(addTimeForEmployee.fulfilled, (state, action) => {
                state.loading = false;
            })

            // Remove Time from Employee
            .addCase(removeTimeFromEmployee.fulfilled, (state, action) => {
                state.loading = false;
            })

            // Create Service
            .addCase(createService.fulfilled, (state) => {
                state.loading = false;
            })

            // Update Service
            .addCase(updateService.fulfilled, (state) => {
                state.loading = false;
            })

            // Delete Service
            .addCase(deleteService.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.services = state.services.filter(service => service.id !== id);
                state.loading = false;
            })

            // Create Combo
            .addCase(createCombo.fulfilled, (state) => {
                state.loading = false;
            })

            // Update Combo
            .addCase(updateCombo.fulfilled, (state) => {
                state.loading = false;
            })

            // Delete Combo
            .addCase(deleteCombo.fulfilled, (state, action) => {
                const { id } = action.payload;
                state.combos = state.combos.filter(combo => combo.id !== id);
                state.loading = false;
            })


            // Common loading
            .addMatcher(
                (action) =>
                    action.type.endsWith('/pending') &&
                    [
                        'management/fetchAccounts',
                        'management/fetchServices',
                        'management/fetchCombos',
                        'management/createEmployee',
                        'management/updateEmployee',
                        'management/changeBlock',
                        'management/fetchTimes',
                        'management/addTimeForEmployee',
                        'management/removeTimeFromEmployee',
                        'management/createService',
                        'management/updateService',
                        'management/deleteService',
                        'management/createCombo',
                        'management/updateCombo',
                        'management/deleteCombo'
                    ].some((type) => action.type.startsWith(type)),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addMatcher(
                (action) =>
                    action.type.endsWith('/rejected') &&
                    [
                        'management/fetchAccounts',
                        'management/fetchServices',
                        'management/fetchCombos',
                        'management/createEmployee',
                        'management/updateEmployee',
                        'management/changeBlock',
                        'management/fetchTimes',
                        'management/addTimeForEmployee',
                        'management/removeTimeFromEmployee',
                        'management/createService',
                        'management/updateService',
                        'management/deleteService',
                        'management/createCombo',
                        'management/updateCombo',
                        'management/deleteCombo'
                    ].some((type) => action.type.startsWith(type)),
                (state, action) => {
                    state.loading = false;
                    state.error = typeof action.payload === 'string' ? action.payload : (action.payload?.message || 'Có lỗi xảy ra');
                }
            );
    }
});

export const { clearManagementError, resetManagementState } = managementSlice.actions;
export default managementSlice.reducer;