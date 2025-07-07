import { useDispatch, useSelector } from 'react-redux';
import {
    sendChatMessage,
    clearMessages,
    addMessage
} from '../stores/slices/aiSlice';
import { toast } from 'react-toastify';

const useAIService = () => {
    const dispatch = useDispatch();
    const { messages, isLoading } = useSelector(state => state.ai);

    const sendMessage = async (message) => {
        try {

            const resultAction = await dispatch(sendChatMessage(message));

            if (sendChatMessage.fulfilled.match(resultAction)) {
                return resultAction.payload;
            } else {
                throw new Error(resultAction.payload?.message || 'Gửi tin nhắn thất bại');
            }
        } catch (error) {
            toast.error(error.message);
            throw error;
        }
    };

    const clearChatHistory = () => {
        dispatch(clearMessages());
    };

    return {
        sendMessage,
        clearChatHistory,
        messages,
        isLoading
    };
};

export default useAIService;