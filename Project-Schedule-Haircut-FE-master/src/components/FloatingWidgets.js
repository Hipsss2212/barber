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

const ChatBox = ({ onClose }) => {
    const [inputMessage, setInputMessage] = useState('');
    const [activeFeature, setActiveFeature] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [isProcessingFace, setIsProcessingFace] = useState(false);
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const webcamRef = useRef(null);
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
    }, [messages, activeFeature, showCamera]);

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

    const captureAndAnalyzeFace = async () => {
        if (!webcamRef.current) {
            toast.error("Camera chưa sẵn sàng");
            return;
        }

        setIsProcessingFace(true);

        try {
            // Thêm hiệu ứng delay để người dùng thấy quá trình đang diễn ra
            await new Promise(resolve => setTimeout(resolve, 500));

            const imageSrc = webcamRef.current.getScreenshot();

            // Hiển thị ảnh đã chụp cho người dùng xem trước
            dispatch(addMessage({
                text: "Đã chụp ảnh khuôn mặt, đang phân tích...",
                isBot: true,
                isError: false,
                image: imageSrc
            }));

            // Giả lập quá trình phân tích khuôn mặt với hiệu ứng loading
            toast.info("Đang phân tích khuôn mặt...");

            // Giả lập thời gian phân tích (trong thực tế sẽ gọi API)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Kết quả giả định - thay bằng API thực tế
            const faceShapes = ["oval", "tròn", "vuông", "trái tim", "dài"];
            const faceFeatures = ["trán cao", "gò má rộng", "cằm nhọn", "mũi thẳng"];
            const randomShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
            const randomFeature = faceFeatures[Math.floor(Math.random() * faceFeatures.length)];

            const faceDescription = `Khuôn mặt ${randomShape}, ${randomFeature}`;

            // Gửi kết quả phân tích về chatbot
            dispatch(addMessage({
                text: `Phân tích khuôn mặt hoàn tất. Đặc điểm: ${faceDescription}`,
                isBot: true,
                isError: false
            }));

            // Gửi prompt đến AI để nhận gợi ý kiểu tóc
            await sendMessage(`Tôi có khuôn mặt với các đặc điểm sau: ${faceDescription}. Hãy gợi ý 3 kiểu tóc phù hợp cho tôi với lý do chi tiết.`);

        } catch (error) {
            toast.error("Lỗi khi phân tích khuôn mặt: " + error.message);
            dispatch(addMessage({
                text: "Xin lỗi, có lỗi xảy ra khi phân tích khuôn mặt. Vui lòng thử lại hoặc mô tả bằng lời.",
                isBot: true,
                isError: true
            }));
        } finally {
            setIsProcessingFace(false);
            setShowCamera(false);
            setCameraEnabled(false);
        }
    };

    const renderCameraModal = () => {
        if (!showCamera) return null;

        return (
            <div className="camera-modal">
                <div className="camera-modal-content">
                    <h3>Quét khuôn mặt</h3>
                    <p>Đặt khuôn mặt trong khung và nhấn "Chụp ảnh"</p>

                    <div className="camera-preview">
                        {cameraEnabled ? (
                            <>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        facingMode: 'user',
                                        width: 400,
                                        height: 400
                                    }}
                                    mirrored={true}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div className="face-scanning-overlay">
                                    <div className="face-scanning-box">
                                        <div className="scanning-line"></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="camera-permission">
                                <p>Vui lòng cho phép sử dụng camera để quét khuôn mặt</p>
                                <button
                                    onClick={() => setCameraEnabled(true)}
                                    className="enable-camera-btn"
                                >
                                    <FaCamera style={{ marginRight: '8px' }} />
                                    Bật Camera
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="camera-actions">
                        {cameraEnabled && (
                            <button
                                onClick={captureAndAnalyzeFace}
                                disabled={isProcessingFace}
                                className="capture-btn"
                            >
                                {isProcessingFace ? (
                                    <>
                                        <FaSpinner className="spinner" /> Đang phân tích...
                                    </>
                                ) : (
                                    <>
                                        <FaCamera style={{ marginRight: '8px' }} />
                                        Chụp ảnh
                                    </>
                                )}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setShowCamera(false);
                                setCameraEnabled(false);
                            }}
                            disabled={isProcessingFace}
                            className="cancel-btn"
                        >
                            <FaTimes style={{ marginRight: '8px' }} />
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            </div>
        );
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
            {activeFeature === 'hairstyle' && (
                <button
                    onClick={() => setShowCamera(true)}
                    disabled={isLoading}
                    className="action-btn camera-btn"
                >
                    <FaCamera /> Quét khuôn mặt
                </button>
            )}
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

    return (
        <div className="chat-box">
            <div className="chat-header">
                <h3>Trợ lý BarberPro</h3>
                <div className="header-actions">
                    <button
                        className="clear-btn"
                        onClick={clearChatHistory}
                        title="Xóa lịch sử chat"
                        disabled={isLoading || isProcessingFace}
                    >
                        Xóa
                    </button>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        disabled={isLoading || isProcessingFace}
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
                    disabled={isLoading || isProcessingFace}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !inputMessage.trim() || isProcessingFace}
                >
                    <FaPaperPlane />
                </button>
            </div>

            {renderCameraModal()}
        </div>
    );
};

const FloatingWidgets = () => {
    const [showChat, setShowChat] = useState(false);
    const navigate = useNavigate();
    const userRole = Cookies.get('role');

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleBarberClick = () => {
        navigate('/cart');
    };

    return (
        <div className="floating-widgets">
            {showChat && <ChatBox onClose={() => setShowChat(false)} />}

            <div className="circle-btn arrow" onClick={scrollToTop}>
                <FaArrowUp color="white" size={20} />
            </div>

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