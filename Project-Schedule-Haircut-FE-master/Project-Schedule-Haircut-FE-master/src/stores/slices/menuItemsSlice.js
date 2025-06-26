// src/stores/slices/categorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

export const fetchServicesAndCombos = createAsyncThunk(
    'menuItems/fetchServicesAndCombos',
    async (categoryId, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get(`/web/service-combo/${categoryId}`);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const menuItemsSlice = createSlice({
    name: 'menuItems',
    initialState: {
        services: [],
        combos: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearMenuItemsError: (state) => {
            state.error = null;
        },
        clearMenuItemsData: (state) => {
            state.services = [];
            state.combos = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServicesAndCombos.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServicesAndCombos.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload.serviceDTOS || [];
                state.combos = action.payload.comboDTOS || [];
            })
            .addCase(fetchServicesAndCombos.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearMenuItemsData, clearMenuItemsError } = menuItemsSlice.actions;

export default menuItemsSlice.reducer;