import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';
import Cookies from 'js-cookie';

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/login', credentials);
            return response;
        } catch (error) {
            console.error('Login API error:', error);
            // Trả về thông tin lỗi chi tiết hơn
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Đăng nhập thất bại',
                status: error.response?.status,
                error: error
            });
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Attempting logout...');
            console.log('Current cookies:', {
                accessToken: Cookies.get('accessToken'),
                username: Cookies.get('username'),
                role: Cookies.get('role')
            });
            
            const response = await axiosClient.get('/web/logout');
            console.log('Logout successful:', response);
            return response;
        } catch (error) {
            console.error("Logout API error:", error);
            console.error("Error response:", error.response);
            console.error("Error status:", error.response?.status);
            console.error("Error data:", error.response?.data);
            console.error("Error config:", error.config);
            
            // Return more detailed error information
            return rejectWithValue({
                message: error.response?.data?.message || error.message || 'Đăng xuất thất bại',
                status: error.response?.status,
                error: error
            });
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/register', userData);
            return response;
        } catch (error) {
            console.error("API error:", error);
            // Chỉ trả về message lỗi đơn giản
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Đăng ký thất bại'
            );
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        initializeAuth: (state, action) => {
            state.user = { username: action.payload.username };
            state.isAuthenticated = action.payload.isAuthenticated;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(logout.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; // Bây giờ chỉ là string
            });
    }
});

export const { clearAuth, clearError, initializeAuth } = authSlice.actions;

export default authSlice.reducer;