import React, { useState } from 'react';
import '../assets/css/StaffLogin.css'; // reuse CSS
import useAuthService from '../services/authService';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../stores/slices/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StaffLoginForm = () => {
    const [credentials, setCredentials] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const { login } = useAuthService();
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
            const user = await login(credentials);
            if (user?.username) {
                dispatch(initializeAuth({
                    username: user.username,
                    isAuthenticated: true,
                }));

                toast.success('Đăng nhập thành công!');
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.message || 'Đăng nhập thất bại.');
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
        <div className="staff-login-container">
            <h2 className="staff-login-title">ĐĂNG NHẬP NHÂN VIÊN</h2>

            {error && <div className="staff-login-error-message">{error}</div>}

            <div className="staff-login-fields">
                <div className="staff-login-input-group">
                    <span className="staff-login-icon">
                        <FontAwesomeIcon icon={faUser} />
                    </span>
                    <input
                        className="staff-login-input"
                        type="text"
                        name="userName"
                        placeholder="Username"
                        value={credentials.userName}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                </div>
                <div className="staff-login-input-group">
                    <span className="staff-login-icon">
                        <FontAwesomeIcon icon={faLock} />
                    </span>
                    <input
                        className="staff-login-input"
                        type={passwordVisible ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                    />
                    <span
                        className="staff-login-password-toggle"
                        onClick={togglePasswordVisibility}
                        style={isLoading ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                    >
                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                    </span>
                </div>

                <button
                    className="staff-login-button"
                    onClick={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </div>
        </div>
    );
};

export default StaffLoginForm;
