import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faKey,
    faLock,
    faCheckCircle,
    faArrowLeft,
    faEye,
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import '../assets/css/VerifyCode.css';
import usePasswordService from '../services/passwordService';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const VerifyCodeForm = ({ onBack, onSuccess }) => {
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { email } = useSelector(state => state.actionForm);
    const { changePassword } = usePasswordService();

    const validateForm = () => {
        if (code.length !== 6) {
            setError('Mã xác thực phải gồm 6 ký tự');
            return false;
        }

        if (newPassword.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return false;
        }

        if (newPassword !== confirmPassword) {
            setError('Mật khẩu không khớp');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await changePassword({ email, code, newPassword });
            onSuccess();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-header">
                <button className="close-button-verify" onClick={onBack} aria-label="Đóng">
                    &times;
                </button>
                <h2 className="verify-title">ĐỔI MẬT KHẨU</h2>
                <p className="verify-description">
                    Mã xác thực đã được gửi đến <span className="email-highlight">{email}</span>
                </p>
            </div>

            <div className="verify-content">
                <form onSubmit={handleSubmit}>
                    {/* Mã xác thực */}
                    <div className="input-group">
                        <FontAwesomeIcon icon={faKey} className="input-icon" />
                        <input
                            type="text"
                            placeholder="Nhập mã 6 ký tự"
                            value={code}
                            onChange={(e) => setCode(e.target.value.slice(0, 6))}
                            className="verify-input"
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Mật khẩu mới */}
                    <div className="input-group">
                        <FontAwesomeIcon icon={faLock} className="input-icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới "
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="verify-input"
                            required
                            disabled={isSubmitting}
                            minLength="8"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isSubmitting}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="input-group">
                        <FontAwesomeIcon icon={faCheckCircle} className="input-icon" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="verify-input"
                            required
                            disabled={isSubmitting}
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isSubmitting}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                </form>

                <div className="verify-footer">
                    <button
                        type="submit"
                        className="verify-button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faKey} className="button-icon" />
                                Xác nhận đổi mật khẩu
                            </>
                        )}
                    </button>

                    <button
                        className="back-button"
                        onClick={onBack}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="button-icon" />
                        Quay lại đăng nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCodeForm;