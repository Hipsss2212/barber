import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../assets/css/BookingConfirmation.css';
import useOrderService from '../services/orderService';
import { parse, format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';

const BookingConfirmation = ({ services, stylists, date, time, onBack }) => {
    // stylists: {haircut: {...}, spa: {...}}
    // time: {haircut: '09:00', spa: '09:30'}
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const totalTime = services.reduce((sum, service) => sum + (service.haircutTime || 0), 0);
    const { loading, error, successMessage } = useSelector(state => state.order);
    const { order } = useOrderService();

    // Prepare order data for backend
    const serviceIds = services.map(service => service.id); // luôn là mảng
    const employeeIds = Object.values(stylists).map(stylist => stylist?.id).filter(Boolean); // luôn là mảng
    // Lấy giờ bắt đầu sớm nhất trong các time đã chọn
    const timesArr = Object.values(time).filter(Boolean);
    const orderStartTime = timesArr.length > 0 ? timesArr.sort()[0] : null;
    const [orderData, setOrderData] = useState({
        orderDate: date && /^\d{4}-\d{2}-\d{2}$/.test(date)
            ? date
            : (date ? format(
                typeof date === 'string' && date.includes('-') && date.trim().length === 14
                    ? parse(date, 'dd - MM - yyyy', new Date())
                    : new Date(date),
                'yyyy-MM-dd'
            ) : ''),
        orderStartTime: orderStartTime,
        totalPrice: totalPrice,
        haircutTime: totalTime,
        comboId: null,
        serviceId: serviceIds, // luôn là mảng
        employeeId: employeeIds // luôn là mảng
    });
    useEffect(() => {
        // Log để kiểm tra dữ liệu gửi lên
        console.log('orderData gửi lên:', orderData);
    }, [orderData]);

    const handleConfirm = async () => {
        try {
            await order(orderData);
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    return (
        <div className="booking-step">
            <h2>5. Xác nhận thông tin</h2>
            <div className="confirmation-section">
                <h3>Dịch vụ đã chọn</h3>
                <ul className="service-list-confirmation">
                    {services.map((service, index) => (
                        <li key={index}>
                            <span className="service-name">{service.name}</span>
                            <span className="service-price">{service.price.toLocaleString()}₫</span>
                            <span className="service-stylist">Thợ: {stylists[service.categoryType]?.fullName || 'N/A'}</span>
                            <span className="service-time">Giờ: {time[service.categoryType] || 'N/A'}</span>
                        </li>
                    ))}
                </ul>
                <div className="service-total">
                    <span className="total-label">Tổng cộng:</span>
                    <span className="total-price">{totalPrice.toLocaleString()}₫</span>
                </div>
            </div>
            <div className="time-total">
                Tổng thời gian sử dụng dịch vụ: <strong>{totalTime} phút</strong>
            </div>
            <div className="step-actions">
                <button className="btn-back" onClick={onBack} disabled={loading}>
                    Quay lại
                </button>
                <button
                    className="btn-confirm"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="spinner-container">
                            <ClipLoader
                                color="#ffffff"
                                size={20}
                                cssOverride={{
                                    marginRight: '8px'
                                }}
                            />
                            Đang xử lý...
                        </div>
                    ) : (
                        'Xác nhận đặt lịch'
                    )}
                </button>
            </div>
            <div className="confirmation-note">
                <p>Cắt xong trả tiền, hủy lịch không sao</p>
            </div>
        </div>
    );
};

export default BookingConfirmation;