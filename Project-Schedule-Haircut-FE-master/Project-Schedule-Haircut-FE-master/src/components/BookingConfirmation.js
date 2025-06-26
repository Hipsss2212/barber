import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/css/BookingConfirmation.css';
import useOrderService from '../services/orderService';
import { parse, format } from 'date-fns';
import ClipLoader from 'react-spinners/ClipLoader';

const BookingConfirmation = ({ services, stylists, date, time, onBack }) => {
    const totalPrice = services.reduce((sum, service) => sum + service.price, 0);
    const totalTime = services.reduce((sum, service) => sum + (service.haircutTime || 0), 0);
    const { loading, error, successMessage } = useSelector(state => state.order);
    const { order } = useOrderService();

    // Hàm chuyển đổi định dạng ngày từ "dd - MM - yyyy" sang "yyyy-MM-dd"
    const formatDateForBackend = (dateString) => {
        try {
            // Parse ngày từ định dạng hiển thị ("21 - 04 - 2025")
            const parsedDate = parse(dateString, 'dd - MM - yyyy', new Date());
            // Format lại thành chuỗi yyyy-MM-dd
            return format(parsedDate, 'yyyy-MM-dd');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString; // Fallback nếu có lỗi
        }
    };

    const [orderData, setOrderData] = useState({
        orderDate: formatDateForBackend(date), // Định dạng lại ngày trước khi lưu
        orderStartTime: `${time}`,
        totalPrice: totalPrice,
        haircutTime: totalTime,
        comboId: null,
        serviceId: new Set(services.map(service => service.id)),
        employeeId: new Set(stylists.map(stylist => stylist.id)),
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleConfirm = async () => {
        try {
            // Chuyển Set thành Array trước khi gửi đi
            const payload = {
                ...orderData,
                serviceId: Array.from(orderData.serviceId),
                employeeId: Array.from(orderData.employeeId),
                // Đảm bảo ngày đã được định dạng đúng
                orderDate: formatDateForBackend(orderData.orderDate),
                orderStartTime: orderData.orderStartTime
            };

            await order(payload);
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
                        </li>
                    ))}
                </ul>

                <div className="service-total">
                    <span className="total-label">Tổng cộng:</span>
                    <span className="total-price">{totalPrice.toLocaleString()}₫</span>
                </div>
            </div>

            <div className="confirmation-section">
                <h3>Thông tin stylist</h3>
                <div className="stylist-info">
                    {stylists.map((stylist, index) => (
                        <div className="stylist-item" key={index}>
                            <img
                                src={stylist.avatar || 'default-avatar.png'}
                                alt={stylist.fullName}
                                className="stylist-photo"
                                onError={(e) => {
                                    e.target.src = 'default-avatar.png';
                                }}
                            />
                            <h4 className="stylist-name">{stylist.fullName}</h4>
                        </div>
                    ))}
                </div>
            </div>

            <div className="time-section">
                <div className="time-title">Thời gian đến</div>
                <div className="time-display">
                    <span>{date}</span>
                    <span>lúc</span>
                    <span>{time}</span>
                </div>

                <div className="time-total">
                    Tổng thời gian sử dụng dịch vụ: <strong>{totalTime} phút</strong>
                </div>
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