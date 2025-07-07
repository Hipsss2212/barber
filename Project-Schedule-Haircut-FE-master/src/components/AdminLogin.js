import React, { useState } from 'react';
import '../assets/css/AdminLogin.css';
import useAuthService from '../services/authService';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../stores/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminLoginForm = () => {
    const [credentials, setCredentials] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { login, logout } = useAuthService();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        if (!credentials.userName || !credentials.password) {
            setError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            // Kiểm tra nếu đã có token, logout trước
            const existingToken = Cookies.get('accessToken');
            if (existingToken) {
                try {
                    await logout();
                } catch (logoutError) {
                    console.log('Logout trước khi đăng nhập:', logoutError);
                }
            }

            const user = await login(credentials);
            if (user?.username) {
                dispatch(initializeAuth({
                    username: user.username,
                    isAuthenticated: true,
                }));

                toast.success('Đăng nhập quản trị thành công!');
                navigate('/admin');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.message || 'Đăng nhập thất bại.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
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
        <div className="admin-login-container">
            <h2 className="admin-login-title">ĐĂNG NHẬP QUẢN TRỊ</h2>

            {error && <div className="admin-login-error-message">{error}</div>}

            <div className="admin-login-fields">
                <div className="admin-login-input-group">
                    <span className="admin-login-icon">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                        className="admin-login-input"
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={credentials.userName}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                </div>
                <div className="admin-login-input-group">
                    <span className="admin-login-icon">
                        <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                        className="admin-login-input"
                        type={passwordVisible ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <span
                        className="admin-login-password-toggle"
                        onClick={togglePasswordVisibility}
                        style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button
                    className="admin-login-button"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </div>
        </div>
    );
};

export default AdminLoginForm;
