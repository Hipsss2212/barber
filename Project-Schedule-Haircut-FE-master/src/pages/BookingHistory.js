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
import FeedbackForm from '../components/FeedbackForm';
import { Modal } from 'antd';
import useProfileService from '../services/profileService';
import { getFeedbackByCustomer } from '../services/feedbackService';
import { Rate } from 'antd';

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [activeStatus, setActiveStatus] = useState(0); // 0: chờ xác nhận, 1: đã xác nhận, 2: đã hoàn thành
    const [paymentLoading, setPaymentLoading] = useState(null);
    const [cancelLoadingId, setCancelLoadingId] = useState(null);
    const { getBookedByStatus } = useBookedService();
    const { loading, error } = useSelector((state) => state.booked);
    const { cancelOrder } = useOrderService();
    const navigate = useNavigate();
    const [openFeedback, setOpenFeedback] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [customerId, setCustomerId] = useState(null);
    const { getProfile } = useProfileService();
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [latestFeedback, setLatestFeedback] = useState(null);

    useEffect(() => {
        // Lấy customerId từ API profile
        async function fetchCustomerId() {
            try {
                // Lấy username từ localStorage hoặc redux (tùy hệ thống)
                const username = localStorage.getItem('username');
                if (username) {
                    const profile = await getProfile(username);
                    setCustomerId(profile.id);
                }
            } catch (e) {
                setCustomerId(null);
            }
        }
        fetchCustomerId();
    }, []);

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

    const handleShowFeedback = async () => {
        if (!customerId) return;
        try {
            const res = await getFeedbackByCustomer(customerId);
            if (res && res.length > 0) {
                // Lấy feedback mới nhất
                const sorted = res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setLatestFeedback(sorted[0]);
            } else {
                setLatestFeedback(null);
            }
            setFeedbackModalOpen(true);
        } catch {
            setLatestFeedback(null);
            setFeedbackModalOpen(true);
        }
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
                    <div className="booking-history booking-history-gradient">
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
                                Có lỗi xảy ra khi tải dữ liệu: {typeof error === 'object' ? error.message || JSON.stringify(error) : error}
                            </div>
                        ) : bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <div className="booking-item booking-item-animated" key={index}>
                                    <img
                                        src="https://tse1.mm.bing.net/th/id/OIP.GDplenID7jPxKG-4WLbFDAHaFV?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                                        alt={booking.serviceName[0]}
                                    />
                                    <div className="details">
                                        <h3 style={{ cursor: 'pointer', color: '#1677ff', textDecoration: 'underline' }} onClick={handleShowFeedback}>
                                            {booking.serviceName.join(', ')}
                                        </h3>
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
                                        {/* Nếu đã hoàn thành (status === 2) thì chỉ hiện nút Thanh toán, ẩn nút Huỷ lịch */}
                                        {activeStatus === 1 && booking.status === 2 ? (
                                            <button
                                                onClick={() => handlePayment(booking)}
                                                disabled={paymentLoading === booking.id}
                                                className="payment-button"
                                            >
                                                {paymentLoading === booking.id ? (
                                                    <ClipLoader size={20} color="#fff" />
                                                ) : 'Thanh toán'}
                                            </button>
                                        ) : (
                                            // Nếu chưa hoàn thành thì vẫn hiện nút Huỷ lịch như cũ
                                            (activeStatus === 0 || (activeStatus === 1 && !isWithinOneHour(booking.orderDate, booking.orderStartTime))) && (
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
                                            )
                                        )}

                                        {activeStatus === 2 && (
                                            <>
                                                <button
                                                    onClick={() => handlePayment(booking)}
                                                    disabled={paymentLoading === booking.id}
                                                    className="payment-button"
                                                >
                                                    {paymentLoading === booking.id ? (
                                                        <ClipLoader size={20} color="#fff" />
                                                    ) : 'Thanh toán'}
                                                </button>
                                                <button className="review-button" onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setOpenFeedback(true);
                                                }}>
                                                    Đánh giá
                                                </button>
                                                <Modal
                                                    open={openFeedback && selectedBooking && selectedBooking.id === booking.id}
                                                    onCancel={() => setOpenFeedback(false)}
                                                    footer={null}
                                                    title="Đánh giá dịch vụ"
                                                    destroyOnClose
                                                >
                                                    {customerId ? (
                                                        <FeedbackForm
                                                            customerId={customerId}
                                                            onSuccess={() => setOpenFeedback(false)}
                                                        />
                                                    ) : (
                                                        <div style={{ color: 'red', textAlign: 'center' }}>
                                                            Không xác định được khách hàng để đánh giá!
                                                        </div>
                                                    )}
                                                </Modal>
                                            </>
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
            <Modal
                open={feedbackModalOpen}
                onCancel={() => setFeedbackModalOpen(false)}
                footer={null}
                title="Feedback của bạn"
                destroyOnClose
            >
                {latestFeedback ? (
                    <div>
                        <Rate value={latestFeedback.rating} disabled />
                        <div style={{ margin: '8px 0' }}>{latestFeedback.content}</div>
                        <div style={{ fontSize: 12, color: '#888' }}>Ngày gửi: {new Date(latestFeedback.createdAt).toLocaleString()}</div>
                    </div>
                ) : (
                    <div style={{ color: 'red', textAlign: 'center' }}>Bạn chưa có feedback nào.</div>
                )}
            </Modal>
        </>
    );
};

export default BookingHistory;