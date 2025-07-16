import React, { useEffect } from 'react';
import '../assets/css/CountService.css';
import useCartService from '../services/cartService';
import Cookies from 'js-cookie';

const CountService = () => {
    const { fetchItemCount, itemCount } = useCartService();
    const userRole = Cookies.get('role');

    useEffect(() => {
        // Chỉ gọi fetchItemCount nếu không phải nhân viên
        if (userRole !== 'ROLE_EMPLOYEE') {
            fetchItemCount();
        }
    }, [userRole]);

    // Không hiển thị gì nếu là nhân viên
    if (userRole === 'ROLE_EMPLOYEE') {
        return null;
    }

    return (
        <div className="barber-badge">
            <span>{itemCount}</span>
        </div>
    );
};

export default CountService;
