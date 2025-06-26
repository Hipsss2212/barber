import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import '../assets/css/BookingHistory.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import haircutImg from '../assets/image/logo.png';
import useBookedService from '../services/bookedService';
import useVnPayService, { useVnPay } from '../services/vnpayService'; // Import the VNPay service
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import useOrderService from '../services/orderService';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [activeStatus, setActiveStatus] = useState(0); // 0: chờ xác nhận, 1: đã xác nhận, 2: đã hoàn thành
    const [paymentLoading, setPaymentLoading] = useState(null);
    const [cancelLoadingId, setCancelLoadingId] = useState(null);
    const { getBookedByStatus } = useBookedService();
    const { loading, error } = useSelector((state) => state.booked);
    const { cancelOrder } = useOrderService();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getBookedByStatus(activeStatus);
                setBookings(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [activeStatus]);

    const statusLabels = ['Chờ xác nhận', 'Đã xác nhận', 'Đã hoàn thành'];

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString) => {
        return timeString.substring(0, 5);
    };

    const handlePayment = (booking) => {
        // Chuyển hướng đến trang thanh toán và truyền state
        navigate(`/payment/${booking.id}`, {
            state: {
                bookingDetails: booking,
                serviceInfo: {
                    employee: booking.employeeName.join(', '),
                    service: booking.serviceName.join(', '),
                    date: formatDate(booking.orderDate),
                    time: `${formatTime(booking.orderStartTime)} - ${formatTime(booking.orderEndTime)}`
                }
            }
        });
    };

    const handleCancel = async (bookingId, status) => {
        setCancelLoadingId(bookingId);
        try {
            await cancelOrder(bookingId, status);

            const data = await getBookedByStatus(activeStatus);
            setBookings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setCancelLoadingId(null);
        }
    };

    const isWithinOneHour = (orderDate, orderTime) => {
        const now = new Date();
        const bookingDateTime = new Date(`${orderDate}T${orderTime}`);
        const timeDiff = bookingDateTime - now;
        return timeDiff <= 3600000; // 1h
    };

    if (loading) {
        return (
            <>
                <Header />
                <main style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: 260,
                    marginBottom: 260,
                }}>
                    <ClipLoader color="#0A2A7C" size={50} />
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main style={{ marginTop: 37, marginBottom: 65 }}>
                <div className="booking-page">
                    <div className="booking-history">
                        <h2>Lịch sử đặt lịch</h2>

                        <div className="status-tabs">
                            {statusLabels.map((label, index) => (
                                <span
                                    key={index}
                                    className={activeStatus === index ? 'active' : ''}
                                    onClick={() => setActiveStatus(index)}
                                >
                                    {label}
                                </span>
                            ))}
                        </div>

                        {error ? (
                            <div className="error-message">
                                Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                            </div>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div className="booking-item" key={index}>
                                    <img
                                        src={booking.serviceName[0].includes('Cắt tóc') ? haircutImg : haircutImg}
                                        alt={booking.serviceName[0]}
                                    />
                                    <div className="details">
                                        <h3>{booking.serviceName.join(', ')}</h3>
                                        <div className="booking-info">
                                            <div className="info-row">
                                                <span className="info-label">Ngày đặt:</span>
                                                <span>{formatDate(booking.orderDate)}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Thời gian:</span>
                                                <span>
                                                    {formatTime(booking.orderStartTime)} - {formatTime(booking.orderEndTime)}
                                                </span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Nhân viên:</span>
                                                <span>{booking.employeeName.join(', ')}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="info-label">Dịch vụ:</span>
                                                <span>{booking.serviceName.join(', ')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="price-action">
                                        <span>{booking.totalPrice.toLocaleString()} VNĐ</span>
                                        {activeStatus === 0 && !isWithinOneHour(booking.orderDate, booking.orderStartTime) && (
                                            <button
                                                onClick={() => handleCancel(booking.id, -1)}
                                                disabled={cancelLoadingId === booking.id}
                                                className="cancel-button"
                                            >
                                                {cancelLoadingId === booking.id ? (
                                                    <ClipLoader size={20} color="#fff" />
                                                ) : (
                                                    'Huỷ lịch'
                                                )}
                                            </button>
                                        )}
                                        {activeStatus === 1 && (
                                            <button
                                                onClick={() => handlePayment(booking)}
                                                disabled={paymentLoading === booking.id}
                                                className="payment-button"
                                            >
                                                {paymentLoading === booking.id ? (
                                                    <ClipLoader size={20} color="#fff" />
                                                ) : 'Thanh toán'}
                                            </button>
                                        )}

                                        {activeStatus === 2 && (
                                            <button className="review-button">
                                                Đánh giá
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-bookings">
                                <p>Không có lịch đặt ở trạng thái này.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default BookingHistory;