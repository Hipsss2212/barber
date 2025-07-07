import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../config/axios';

// Async thunk để gửi tin nhắn đến chatbot
export const sendChatMessage = createAsyncThunk(
    'ai/sendMessage',
    async (message, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/web/chatbot/ask', {
                message: typeof message === 'string' ? message : JSON.stringify(message)
            });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const aiSlice = createSlice({
    name: 'ai',
    initialState: {
        messages: [],
        isLoading: false,
        error: null
    },
    reducers: {
        clearMessages: (state) => {
            state.messages = [];
        },
        addMessage: (state, action) => {
            state.messages.push({
                ...action.payload,
                id: Date.now(),
                timestamp: new Date().toISOString()
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendChatMessage.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendChatMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                if (!state.messages.some(msg => msg.text === action.payload && msg.isBot)) {
                    state.messages.push({
                        text: action.payload,
                        isBot: true,
                        isError: false,
                        id: Date.now(),
                        timestamp: new Date().toISOString()
                    });
                }
            })
            .addCase(sendChatMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.messages.push({
                    text: action.payload?.message || 'Đã xảy ra lỗi',
                    isBot: true,
                    isError: true,
                    id: Date.now(),
                    timestamp: new Date().toISOString()
                });
            });
    }
});

export const { clearMessages, addMessage } = aiSlice.actions;
export default aiSlice.reducer;