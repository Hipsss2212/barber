import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/VerifyEmail.css';

const VerifyEmail = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showResend, setShowResend] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('http://localhost:9090/api/v1/web/api/auth/verify-email', 
                { token: verificationCode }
            );
            toast.success(res.data);
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        } catch (err) {
            toast.error(err.response?.data || 'Xác thực thất bại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async (e) => {
        e.preventDefault();
        setIsResending(true);
        try {
            const res = await axios.post('http://localhost:9090/api/v1/web/api/auth/resend-verification', { email: resendEmail });
            toast.success(res.data);
            setShowResend(false);
        } catch (err) {
            toast.error(err.response?.data || 'Gửi lại mã thất bại.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="verify-email-container">
            <div className="verify-email-box">
                <h2>Xác thực tài khoản</h2>
                <p>Vui lòng nhập mã xác thực đã được gửi đến email của bạn</p>
                
                <form onSubmit={handleSubmit}>
                    <div className="verification-code-input">
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Nhập mã xác thực"
                            maxLength="6"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="verify-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                    </button>
                </form>
                <div style={{ marginTop: 16 }}>
                    {!showResend ? (
                        <button className="verify-button" style={{ background: '#34a853' }} onClick={() => setShowResend(true)}>
                            Gửi lại mã xác thực
                        </button>
                    ) : (
                        <form onSubmit={handleResend} style={{ marginTop: 12 }}>
                            <input
                                type="email"
                                value={resendEmail}
                                onChange={e => setResendEmail(e.target.value)}
                                placeholder="Nhập email đăng ký"
                                required
                                style={{ width: '100%', padding: 10, marginBottom: 8 }}
                            />
                            <button type="submit" className="verify-button" disabled={isResending}>
                                {isResending ? 'Đang gửi...' : 'Gửi mã'}
                            </button>
                            <button type="button" className="verify-button" style={{ background: '#ccc', color: '#333', marginTop: 8 }} onClick={() => setShowResend(false)}>
                                Hủy
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail; 