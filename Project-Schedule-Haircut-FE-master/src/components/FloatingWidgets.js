import React, { useState, useRef, useEffect } from 'react';
import '../assets/css/FloatingWidgets.css';
import botImg from '../assets/image/bot.jpg';
import barberImg from '../assets/image/barber.png';
import { FaArrowUp, FaTimes, FaPaperPlane, FaCut, FaCamera, FaSpinner } from 'react-icons/fa';
import CountService from './CountService';
import { useNavigate } from 'react-router-dom';
import useAIService from '../services/aiService';
import { toast } from 'react-toastify';
import { addMessage } from '../stores/slices/aiSlice';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import Webcam from 'react-webcam';
import FaceAutoAnalysis from './FaceAutoAnalysis';

const ChatBox = ({ onClose }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const dispatch = useDispatch();

    const {
        sendMessage,
        messages,
        isLoading,
        clearChatHistory
    } = useAIService();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, activeFeature]);

    const handleSend = async () => {
        try {
            if (!inputMessage.trim()) return;

            dispatch(addMessage({
                text: inputMessage,
                isBot: false,
                isError: false
            }));

            await sendMessage(inputMessage);
            setInputMessage('');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleQuickAction = async (action) => {
        setActiveFeature(action);
        setInputMessage('');
        inputRef.current.focus();

        let message = '';
        switch (action) {
            case 'hairstyle':
                message = "Bạn muốn mô tả khuôn mặt hoặc sử dụng camera để quét khuôn mặt?";
                break;
            default:
                message = "Tôi có thể giúp gì cho bạn?";
        }

        dispatch(addMessage({
            text: message,
            isBot: true,
            isError: false
        }));
    };

    const handleFaceAnalysisResult = async (result) => {
        if (result && result.shape && result.description) {
            const faceDescription = `Khuôn mặt ${result.shape.toLowerCase()}, ${result.description}`;
            dispatch(addMessage({
                text: `Phân tích khuôn mặt hoàn tất. Đặc điểm: ${faceDescription}`,
                isBot: true,
                isError: false
            }));
            await sendMessage(`Tôi có khuôn mặt với các đặc điểm sau: ${faceDescription}. Hãy gợi ý 3 kiểu tóc phù hợp cho tôi với lý do chi tiết.`);
        }
    };

    const renderQuickActions = () => (
        <div className="quick-actions">
            <button
                onClick={() => handleQuickAction('hairstyle')}
                className={`action-btn ${activeFeature === 'hairstyle' ? 'active' : ''}`}
                disabled={isLoading}
            >
                <FaCut /> Gợi ý kiểu tóc
            </button>
        </div>
    );

    const renderMessageContent = (msg) => {
        if (msg.image) {
            return (
                <div className="message-image-container">
                    <img src={msg.image} alt="Ảnh đã chụp" className="message-image" />
                    {msg.text && <div className="message-text">{msg.text}</div>}
                </div>
            );
        }

        return msg.text.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line.startsWith('-') ? (
                    <div style={{ marginLeft: '15px' }}>{line}</div>
                ) : (
                    <div>{line}</div>
                )}
                <br />
            </React.Fragment>
        ));
    };

    useEffect(() => {
        window.ChatBoxHandleFaceAnalysisResult = handleFaceAnalysisResult;
        return () => {
            window.ChatBoxHandleFaceAnalysisResult = undefined;
        };
    }, []);

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Trợ lý BarberPro</h3>
                <div className="header-actions">
                    <button
                        className="clear-btn"
                        onClick={clearChatHistory}
                        title="Xóa lịch sử chat"
                        disabled={isLoading}
                    >
                        Xóa
                    </button>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
            </div>

            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-container ${msg.isBot ? 'bot' : 'user'}`}
                    >
                        {msg.isBot ? (
                            <img src={botImg} alt="Bot avatar" className="message-avatar" />
                        ) : (
                            <img src={barberImg} alt="User avatar" className="message-avatar" />
                        )}

                        <div className={`message ${msg.isError ? 'error' : ''}`}>
                            {renderMessageContent(msg)}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="message-container bot">
                        <img src={botImg} alt="Bot avatar" className="message-avatar" />
                        <div className="message loading">
                            <FaSpinner className="spinner" />
                            <span>Đang trả lời...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {renderQuickActions()}

            <div className="chat-input">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                        activeFeature === 'hairstyle' ?
                            "Mô tả khuôn mặt/kiểu tóc hoặc quét bằng camera..." :
                            "Nhập tin nhắn..."
                    }
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !inputMessage.trim()}
                >
                    <FaPaperPlane />
                </button>
            </div>

            {/* FaceAutoAnalysis is now managed by FloatingWidgets */}
        </div>
    );
};

const FloatingWidgets = () => {
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();
    const userRole = Cookies.get('role');
    const [showFaceAnalysis, setShowFaceAnalysis] = useState(false);
    const [pendingFaceResult, setPendingFaceResult] = useState(null);

    // Định nghĩa hàm nhận kết quả từ FaceAutoAnalysis và truyền sang ChatBox, đồng thời mở chatbox
    const handleFaceAnalysisResult = (result) => {
        setShowChat(true);
        setPendingFaceResult(result);
    };

    useEffect(() => {
        if (showChat && pendingFaceResult && window.ChatBoxHandleFaceAnalysisResult) {
            window.ChatBoxHandleFaceAnalysisResult(pendingFaceResult);
            setPendingFaceResult(null);
        }
    }, [showChat, pendingFaceResult]);

    const scrollToTop = () => {
        window.scrollTo({
            behavior: 'smooth'
        });
    };

    const handleBarberClick = () => {
        navigate('/cart');
    };

    // Gán hàm cho window để FaceAutoAnalysis gọi được
    if (showFaceAnalysis) {
        window.handleFaceAnalysisResult = handleFaceAnalysisResult;
    }

    return (
        <div className="floating-widgets">
            {showChat && <ChatBox onClose={() => setShowChat(false)} />}

            {/* Nút mũi tên lên */}
            <div className="circle-btn arrow" onClick={scrollToTop}>
                <FaArrowUp color="white" size={20} />
            </div>

            {/* Nút nhận diện gương mặt ở vị trí thứ 2 */}
            <div className="circle-btn face-recognition-btn" onClick={() => setShowFaceAnalysis(true)} title="Nhận diện gương mặt">
                <img src="https://png.pngtree.com/png-vector/20190803/ourlarge/pngtree-colorful-bio-metrics-face-recognition-icon-on-gray-background-png-image_1657193.jpg" alt="Face Recognition" style={{ width: 32, height: 32, borderRadius: '50%' }} />
            </div>

            {showFaceAnalysis && (
                <FaceAutoAnalysis
                    onResult={() => setShowFaceAnalysis(false)}
                    onClose={() => setShowFaceAnalysis(false)}
                    noOverlay={false}
                />
            )}
            {/* Gán handleFaceAnalysisResult cho window để FaceAutoAnalysis gọi được */}
            {showFaceAnalysis && (window.handleFaceAnalysisResult = handleFaceAnalysisResult)}

            <div
                className="circle-btn"
                onClick={() => setShowChat(!showChat)}
            >
                <img src={botImg} alt="Chatbot" />
            </div>

            {/* Chỉ hiển thị nút cart nếu không phải nhân viên */}
            {userRole !== 'ROLE_EMPLOYEE' && (
                <div
                    className="circle-btn outline"
                    onClick={handleBarberClick}
                >
                    <img src={barberImg} alt="Barber" />
                    <CountService />
                </div>
            )}
        </div>
    );
};

export default FloatingWidgets;