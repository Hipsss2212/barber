import React, { useEffect, useState, useRef } from 'react';
import { matchPath, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import useAuthService from '../../services/authService';

const PrivateRoute = ({ children, role, blockedRoles = [], loginPage, allowUnauthenticatedPaths = [] }) => {
    const token = Cookies.get('accessToken');
    const userRole = Cookies.get('role');
    const location = useLocation();
    const { logout } = useAuthService();

    const [status, setStatus] = useState('checking');
    const toastShownRef = useRef(false);

    useEffect(() => {
        const currentPath = location.pathname;

        const isAllowedPath = allowUnauthenticatedPaths.some((path) =>
            matchPath({ path, end: false }, currentPath)
        );

        if (!token && isAllowedPath) {
            setStatus('authorized');
            return;
        }

        if (!token) {
            if (loginPage) {
                setStatus('showLogin');
            } else {
                if (!toastShownRef.current) {
                    toastShownRef.current = true;
                    toast.warn('Bạn cần đăng nhập để truy cập vào trang này');
                }
                setTimeout(() => setStatus('redirect'), 1000);
            }
        } else if (blockedRoles.includes(userRole)) {
            if (!toastShownRef.current) {
                toastShownRef.current = true;
                toast.error('Bạn không được phép truy cập trang này');
            }
            logout();
            setStatus('blocked');
        } else {
            setStatus('authorized');
        }
    }, [token, userRole, role, blockedRoles, loginPage, location.pathname, allowUnauthenticatedPaths]);

    if (status === 'checking') return null;
    if (status === 'redirect') return <Navigate to="/home" replace />;
    if (status === 'unauthorized' || status === 'blocked') return null;
    if (status === 'authorized') return children;
    if (status === 'showLogin') return loginPage;

    return null;
};

export default PrivateRoute;