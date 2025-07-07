// stores/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showAuthModal: false, // Hiện modal hay không
    currentForm: 'login', // 'login' | 'register' | 'forgot' | 'verify'
    email: '', // Lưu email khi chuyển từ forgot sang verify
    modalProps: {}, // Props bổ sung cho modal
    formResetKey: Date.now() // Để reset lại form khi chuyển đổi giữa các form
};

const actionFormSlice = createSlice({
    name: 'actionForm',
    initialState,
    reducers: {
        showAuthModal: (state, action) => {
            state.showAuthModal = true;
            state.currentForm = action.payload?.form || 'login';
            state.modalProps = action.payload?.props || {};
            state.formResetKey = Date.now();
        },
        hideAuthModal: (state) => {
            return initialState;
        },
        switchAuthForm: (state, action) => {
            state.currentForm = action.payload.form;
            if (action.payload.email) {
                state.email = action.payload.email;
            }
            state.formResetKey = Date.now();
        },
        setAuthEmail: (state, action) => {
            state.email = action.payload;
        }
    }
});

export const { showAuthModal, hideAuthModal, switchAuthForm, setAuthEmail } = actionFormSlice.actions;
export default actionFormSlice.reducer;