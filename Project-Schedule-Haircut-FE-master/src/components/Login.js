import React, { useState } from 'react';
import '../assets/css/Login.css';
import useAuthService from '../services/authService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../stores/slices/authSlice';
import useCartService from '../services/cartService';
import axios from 'axios';
import Cookies from 'js-cookie';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = ({ onClose, onSwitchToRegister, onSwitchToForgotPassword }) => {
    const [credentials, setCredentials] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { login } = useAuthService();
    const { fetchItemCount } = useCartService();
    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            setCredentials({ userName: '', password: '' });
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async () => {
        if (!credentials.userName || !credentials.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const user = await login(credentials);
            if (user?.username) {
                dispatch(initializeAuth({
                    username: user.username,
                    isAuthenticated: true,
                }));

                // Lưu customerId nếu là khách hàng
                if (user.role === 'ROLE_USER') {
                    // Ưu tiên user.customerId, nếu không có thì dùng user.id
                    const customerId = user.customerId || user.id;
                    if (customerId) {
                        localStorage.setItem('customerId', customerId);
                        console.log('Đã lưu customerId:', customerId);
                    } else {
                        console.warn('Không tìm thấy customerId trong dữ liệu trả về:', user);
                    }
                } else {
                    // Nếu không phải customer thì xóa customerId khỏi localStorage
                    localStorage.removeItem('customerId');
                }

                toast.success('Đăng nhập thành công!');
                // Chỉ gọi fetchItemCount nếu không phải nhân viên
                if (user.role !== 'ROLE_EMPLOYEE') {
                    await fetchItemCount();
                }
                if (user.role === 'ROLE_ADMIN') {
                    window.location.href = '/admin';
                } else if (user.role === 'ROLE_EMPLOYEE') {
                    window.location.href = '/employee/home';
                } else {
                    window.location.href = '/home';
                }
                onClose();
            }
        } catch (error) {
            // Sửa triệt để: chỉ hiện toast và chuyển về Home nếu là lỗi đăng nhập nơi khác hoặc bị khóa, không setError
            const msg = error.message || '';
            if (msg.includes('Tài khoản đã đăng nhập ở thiết bị khác')) {
                toast.error('Tài khoản đã đăng nhập ở thiết bị khác. Vui lòng đăng xuất trước khi đăng nhập lại.');
                window.location.href = '/home';
                return;
            }
            if (msg.includes('Tài khoản của bạn bị khóa')) {
                toast.error('Tài khoản của bạn bị khóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.');
                window.location.href = '/home';
                return;
            }
            // Chỉ setError nếu KHÔNG phải lỗi đặc biệt
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const res = await axios.post(
                'http://localhost:9090/api/v1/api/auth/google',
                { idToken: credentialResponse.credential }
            );
            localStorage.setItem('token', res.data.token);
            dispatch(initializeAuth({
                username: res.data.username,
                isAuthenticated: true,
            }));
            toast.success('Đăng nhập Google thành công!');
            onClose && onClose();
        } catch (err) {
            toast.error('Đăng nhập Google thất bại!');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(prev => !prev);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <button className="close-button" onClick={onClose}>×</button>
            <h2 className="login-title">ĐĂNG NHẬP</h2>

            {/* Chỉ render error nếu KHÔNG phải lỗi đăng nhập nơi khác hoặc bị khóa */}
            {error && !error.includes('Tài khoản đã đăng nhập ở thiết bị khác') && !error.includes('Tài khoản của bạn bị khóa') && (
                <div className="error-message">{error}</div>
            )}

            <div className="login-fields">
                <div className="input-group">
                    <span className="icon">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={credentials.userName}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="input-group">
                    <span className="icon">
                        <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                        type={passwordVisible ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        required
                        disabled={isLoading}
                    />
                    <span
                        className="password-toggle"
                        onClick={togglePasswordVisibility}
                        style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </span>
                </div>
                <a
                    href="#"
                    className="forgot-password"
                    onClick={onSwitchToForgotPassword}
                    style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                >
                    Quên mật khẩu?
                </a>
                <button
                    className="login-button"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {' '}Đang đăng nhập...
                        </>
                    ) : 'Đăng nhập'}
                </button>
            </div>

            {/* Thêm nút Google Login vào giao diện */}
            <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => toast.error('Đăng nhập Google thất bại!')}
                // Không truyền các props undefined
            />

            <div className="register-link">
                Bạn chưa có tài khoản?{' '}
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        if (!isLoading) onSwitchToRegister();
                    }}
                    style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                >
                    Đăng ký ngay
                </a>
            </div>
        </div>
    );
};

export default LoginForm;