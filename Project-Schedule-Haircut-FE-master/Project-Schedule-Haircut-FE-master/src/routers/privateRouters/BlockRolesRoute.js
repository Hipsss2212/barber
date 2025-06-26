import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import useAuthService from '../../services/authService';

const BlockRolesRoute = ({ children, blockedRoles = [] }) => {
    const userRole = Cookies.get('role');
    const location = useLocation();
    const { logout } = useAuthService();
    const toastShownRef = React.useRef(false);

    useEffect(() => {
        if (blockedRoles.includes(userRole) && !toastShownRef.current) {
            toastShownRef.current = true;
            toast.error('Bạn không được phép truy cập trang này');
            logout();
        }
    }, [userRole, blockedRoles, logout, location.pathname]);

    if (blockedRoles.includes(userRole)) return null;

    return children;
};

export default BlockRolesRoute;