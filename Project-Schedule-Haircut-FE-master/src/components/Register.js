import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser, faEnvelope, faLock, faEye, faEyeSlash,
    faPhone, faAddressBook, faSignature, faHashtag
} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/Register.css';
import useAuthService from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RegisterForm = ({ onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuthService();
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        fullName: '',
        password: '',
        phone: '',
        address: '',
        age: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const navigate = useNavigate();
    const error = useSelector(state => state.auth.error);

    React.useEffect(() => {
        return () => {
            setFormData({
                userName: '',
                email: '',
                fullName: '',
                password: '',
                phone: '',
                address: '',
                age: '',
                confirmPassword: ''
            });
            setErrors({});
        }
    }, []);

    const validate = () => {
        const newErrors = {};

        if (!/^0\d{9,10}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ (bắt đầu bằng 0, 10-11 số)';
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu nhập lại không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validate()) {
            setIsLoading(true);
            try {
                const { confirmPassword, ...requestData } = formData;
                const result = await register(requestData);
                setRegisterSuccess(true);
                setTimeout(() => {
                    navigate('/verify-email');
                }, 1000);
            } catch (error) {
                console.log(error);
                toast.error(error.message || 'Đăng ký thất bại');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (field) => (e) => {
        const value = field === 'age' ? e.target.value.replace(/\D/g, '') : e.target.value;
        setFormData({ ...formData, [field]: value });
    };

    if (registerSuccess) {
        return (
            <div className="register-container">
                <h2>Đăng ký thành công!</h2>
                <p>Vui lòng kiểm tra email để lấy mã xác thực tài khoản.</p>
                <p>Bạn sẽ được chuyển sang trang nhập mã xác thực trong giây lát...</p>
            </div>
        );
    }

    return (
        <div className="register-container">
            <button className="close-button" onClick={onClose}>×</button>
            <h2 className="register-title">ĐĂNG KÝ</h2>

            {error && <div className="error-message" style={{ color: 'red', marginBottom: 8 }}>{error}</div>}

            <div className="register-content">

                <div className="input-group">
                    <FontAwesomeIcon icon={faUser} className="icon" />
                    <input type="text" placeholder="Nhập tên đăng nhập" value={formData.userName} onChange={handleChange('userName')} />
                </div>

                <div className="input-group">
                    <FontAwesomeIcon icon={faSignature} className="icon" />
                    <input type="text" placeholder="Nhập họ và tên" value={formData.fullName} onChange={handleChange('fullName')} />
                </div>

                <div className="input-group">
                    <FontAwesomeIcon icon={faPhone} className="icon" />
                    <input type="text" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange('phone')} />
                </div>
                {errors.phone && <p className="error-message">{errors.phone}</p>}

                <div className="input-group">
                    <FontAwesomeIcon icon={faEnvelope} className="icon" />
                    <input type="email" placeholder="Nhập email" value={formData.email} onChange={handleChange('email')} />
                </div>
                {errors.email && <p className="error-message">{errors.email}</p>}

                <div className="input-group">
                    <FontAwesomeIcon icon={faAddressBook} className="icon" />
                    <input type="text" placeholder="Nhập địa chỉ" value={formData.address} onChange={handleChange('address')} />
                </div>

                <div className="input-group">
                    <FontAwesomeIcon icon={faHashtag} className="icon" />
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Nhập tuổi"
                        value={formData.age}
                        onChange={handleChange('age')}
                    />
                </div>

                <div className="input-group">
                    <FontAwesomeIcon icon={faLock} className="icon" />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={handleChange('password')}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}

                <div className="input-group">
                    <FontAwesomeIcon icon={faLock} className="icon" />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange('confirmPassword')}
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                    </button>
                </div>
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}

                <button
                    className="register-button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {' '}Đang xử lý...
                        </>
                    ) : 'Đăng Ký'}
                </button>
            </div>

            <div className="register-footer">
                <div className="login-link">
                    Bạn đã có tài khoản?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
                        Đăng nhập ngay
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
