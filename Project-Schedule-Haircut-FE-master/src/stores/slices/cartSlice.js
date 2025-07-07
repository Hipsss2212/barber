import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/customer/cart-items');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addComboToCart = createAsyncThunk(
    'cart/addCombo',
    async (comboData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/add/combo', comboData);
            console.log(response);

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addServiceToCart = createAsyncThunk(
    'cart/addService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/add/service', serviceData);
            console.log(response);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const countCartItems = createAsyncThunk(
    'cart/countItems',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get('/web/count-item');
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteCartItems = createAsyncThunk(
    'cart/deleteItems',
    async (cartItemIds, { rejectWithValue }) => {
        try {
            const response = await axiosClient.delete('/customer/delete-items', {
                data: cartItemIds
            });

            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        loading: false,
        error: null,
        lastUpdated: null,
        totalPrice: 0,
        totalTime: 0,
        itemCount: 0
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
        clearCartItems: (state) => {
            state.items = [];
            state.totalPrice = 0;
            state.totalTime = 0;
            state.lastUpdated = null;
        },
        removeCartItem: (state, action) => {
            const cartItemId = action.payload;
            state.items = state.items.filter(item => item.cartItemId !== cartItemId);
            state.totalPrice = state.items.reduce((sum, item) =>
                sum + (item.price * item.quantity), 0);
            state.totalTime = state.items.reduce((sum, item) =>
                sum + (item.haircutTime * item.quantity), 0);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
                state.totalPrice = action.payload?.reduce((sum, item) => sum + (item?.price || 0), 0) || 0;
                state.totalTime = action.payload?.reduce((sum, item) => sum + (item?.haircutTime || 0), 0) || 0;
                state.lastUpdated = new Date().toISOString();
            })
            .addCase(getCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Lỗi tải giỏ hàng';
            })

            .addCase(addComboToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComboToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addComboToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addServiceToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addServiceToCart.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addServiceToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(countCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(countCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.itemCount = action.payload;
            })
            .addCase(countCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteCartItems.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCartItems.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.deletedIds) {
                    state.items = state.items.filter(item =>
                        !action.payload.deletedIds.includes(item.cartItemId)
                    );
                }
                state.totalPrice = state.items.reduce((sum, item) => sum + item.price, 0);
                state.totalTime = state.items.reduce((sum, item) => sum + item.haircutTime, 0);
            })
            .addCase(deleteCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Xóa CartItem thất bại';
            });
    }
});

export const {
    clearCartError,
    clearCartItems,
    removeCartItem,
} = cartSlice.actions;

export default cartSlice.reducer;