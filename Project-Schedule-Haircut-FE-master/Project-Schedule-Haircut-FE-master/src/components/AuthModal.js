// components/AuthModal.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideAuthModal, switchAuthForm } from '../stores/slices/actionFormSlice';
import LoginForm from '../components/Login';
import RegisterForm from '../components/Register';
import ForgotPasswordForm from '../components/ForgotPassword';
import VerifyCodeForm from '../components/VerifyCode';
import '../assets/css/AuthModal.css';

const AuthModal = () => {
    const dispatch = useDispatch();
    const {
        showAuthModal,
        currentForm,
        email,
        modalProps,
        formResetKey
    } = useSelector(state => state.actionForm);
    const [transition, setTransition] = React.useState(false);

    const handleSwitchForm = (form, email = '') => {
        setTransition(true);
        setTimeout(() => {
            dispatch(switchAuthForm({ form, email }));
            setTransition(false);
        }, 300);
    };

    const handleCloseModal = () => {
        dispatch(hideAuthModal());
    };

    if (!showAuthModal) return null;

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-container">
                {/* Login Form */}
                <div className={`auth-form ${currentForm === 'login' ? 'active' : 'left'}`}>
                    <LoginForm
                        key={`login-${formResetKey}`}
                        onClose={handleCloseModal}
                        onSwitchToRegister={() => handleSwitchForm('register')}
                        onSwitchToForgotPassword={() => handleSwitchForm('forgot')}
                        {...modalProps}
                    />
                </div>


                {/* Register Form */}
                <div className={`auth-form ${currentForm === 'register' ? 'active' : 'left'}`}
                    style={{ display: currentForm === 'register' ? 'flex' : 'none' }}>
                    <RegisterForm
                        key={`register-${formResetKey}`}
                        onClose={handleCloseModal}
                        onSwitchToLogin={() => handleSwitchForm('login')}
                        {...modalProps}
                    />
                </div>

                {/* Forgot Password Form */}
                <div className={`auth-form ${currentForm === 'forgot' ? 'active' : transition ? 'right' : 'left'}`}>
                    <ForgotPasswordForm
                        key={`forgot-${formResetKey}`}
                        onClose={handleCloseModal}
                        onBackToLogin={() => handleSwitchForm('login')}
                        onGoToVerify={(email) => handleSwitchForm('verify', email)}
                        {...modalProps}
                    />
                </div>

                {/* Verify Code Form */}
                <div className={`auth-form ${currentForm === 'verify' ? 'active' : transition ? 'right' : 'left'}`}>
                    <VerifyCodeForm
                        key={`verify-${formResetKey}`}
                        onClose={handleCloseModal}
                        onBack={() => handleSwitchForm('login')}
                        onSuccess={() => handleSwitchForm('login')}
                        {...modalProps}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthModal;