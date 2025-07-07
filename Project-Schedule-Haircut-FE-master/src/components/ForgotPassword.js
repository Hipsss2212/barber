import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import '../assets/css/ForgotPassword.css';
import usePasswordService from '../services/passwordService';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthEmail } from '../stores/slices/actionFormSlice';

const ForgotPasswordForm = ({ onClose, onBackToLogin, onGoToVerify }) => {
    const [localEmail, setLocalEmail] = useState('');
    const { loading } = useSelector(state => state.password);
    const { requestChangePassword } = usePasswordService();
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            setLocalEmail('');
        };
    }, []);

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!localEmail) {
            toast.error('Vui lòng nhập địa chỉ email');
            return;
        }

        if (!validateEmail(localEmail)) {
            toast.error('Email không hợp lệ');
            return;
        }

        try {
            const { message } = await requestChangePassword(localEmail);
            dispatch(setAuthEmail(localEmail));
            toast.success(message);
            setTimeout(() => {
                onGoToVerify(localEmail);
            }, [2000]);
        } catch (err) {
            toast.error(err);
        }
    };

    return (
        <div className="forgot-container">
            <button className="close-button" onClick={onClose}>×</button>
            <h2 className="forgot-title">QUÊN MẬT KHẨU</h2>
            <p className="forgot-description">Vui lòng nhập địa chỉ email bạn đã đăng ký trên Bossbarber.</p>

            <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={localEmail}
                    onChange={(e) => setLocalEmail(e.target.value)}
                    required
                    disabled={loading}
                />
            </div>

            <button
                className={`send-button ${loading ? 'loading' : ''}`}
                onClick={handleSubmit}
                disabled={loading || !localEmail}
            >
                {loading ? (
                    <>
                        <FontAwesomeIcon
                            icon={faCircleNotch}
                            spin
                            className="spinner-icon"
                        />
                        <span className="loading-text">Đang gửi...</span>
                    </>
                ) : (
                    'Gửi mã xác thực'
                )}
            </button>

            <div className="back-login">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!loading) onBackToLogin();
                    }}
                    style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
                >
                    Quay lại đăng nhập
                </a>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;