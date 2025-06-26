import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import useVnPayService from '../services/vnpayService';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import '../assets/css/PaymentPage.css';
import momoImage from '../assets/image/momo.png'; // Sửa đường dẫn import
import zaloImage from '../assets/image/zalo.png';
import vnpayImage from '../assets/image/vnpay.png';
import Footer from '../components/Footer';
import Header from '../components/Header';
import useZaloPayService from '../services/zalopayService';

const PaymentPage = () => {
    const { bookingId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('');
    const [loading, setLoading] = useState(false);
    const { bookingDetails, serviceInfo } = location.state || {};

    const { handlePaymentResult: handleVnPayResult, initiatePayment: initiateVnPayPayment } = useVnPayService();
    const { handlePaymentResult: handleZaloPayResult, initiatePayment: initiateZaloPayPayment } = useZaloPayService();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (searchParams.toString()) {
            if (searchParams.get('vnp_ResponseCode')) {
                handleVnPayResult(searchParams);
            } else if (searchParams.get('status')) {
                handleZaloPayResult(searchParams);
            }
        }
    }, [searchParams, handleVnPayResult, handleZaloPayResult]);


    // Kiểm tra thông tin hợp lệ
    useEffect(() => {
        if (!bookingDetails || !serviceInfo) {
            toast.error('Thông tin đơn hàng không hợp lệ');
            navigate('/bookings');
        }
    }, [bookingDetails, serviceInfo, navigate]);

    const handlePayment = async () => {
        if (!selectedMethod) {
            toast.error('Vui lòng chọn phương thức thanh toán');
            return;
        }

        try {
            setLoading(true);

            if (selectedMethod === 'vnpay') {
                await initiateVnPayPayment(bookingDetails.totalPrice, bookingId);
            } else if (selectedMethod === 'zalopay') {
                // await initiateZaloPayPayment(bookingDetails.totalPrice, bookingId);
                toast.info('Phương thức ZaloPay đang được phát triển');
            } else if (selectedMethod === 'momo') {
                // TODO: xử lý momo ở đây nếu bạn làm sau
                toast.info('Phương thức MoMo đang được phát triển');
            }

        } catch (error) {
            // toast.error(error.message || 'Lỗi thanh toán');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Header />
            <div className="payment-page">
                <h2>Thanh toán cho lịch hẹn</h2>

                <div className="booking-info">
                    <h3>Thông tin lịch hẹn</h3>
                    <div className="info-row">
                        <span className="info-label">Dịch vụ:</span>
                        <div className="info-content">
                            {Array.isArray(serviceInfo?.service)
                                ? serviceInfo.service.map((service, index) => (
                                    <span className="service-badge" key={index}>{service}</span>
                                ))
                                : <span>{serviceInfo?.service}</span>}
                        </div>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Nhân viên:</span>
                        <div className="info-content">
                            {Array.isArray(serviceInfo?.employee)
                                ? serviceInfo.employee.map((staff, index) => (
                                    <span className="staff-badge" key={index}>{staff}</span>
                                ))
                                : <span>{serviceInfo?.employee}</span>}
                        </div>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Ngày:</span>
                        <div className="info-content">{serviceInfo?.date}</div>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Giờ:</span>
                        <div className="info-content">{serviceInfo?.time}</div>
                    </div>

                    <div className="info-row">
                        <span className="info-label">Tổng tiền:</span>
                        <div className="info-content">
                            {bookingDetails?.totalPrice?.toLocaleString()} VNĐ
                        </div>
                    </div>
                </div>

                <div className="payment-methods">
                    <h3>Chọn phương thức thanh toán</h3>

                    <div className="method-options">
                        {/* Phương thức VNPAY */}
                        <label className="method-item">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="vnpay"
                                onChange={(e) => setSelectedMethod(e.target.value)}
                            />
                            <img
                                src={vnpayImage}
                                alt="VNPAY"
                                className="method-icon"
                                width={40}
                                height={40}
                            />
                            <span>VNPAY</span>
                        </label>

                        {/* Phương thức MoMo */}
                        <label className="method-item">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="momo"
                                onChange={(e) => setSelectedMethod(e.target.value)}
                            />
                            <img
                                src={momoImage}
                                alt="MoMo"
                                className="method-icon"
                                width={40}
                                height={40}
                            />
                            <span>Ví MoMo</span>
                        </label>

                        {/* Phương thức ZaloPay */}
                        <label className="method-item">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="zalopay"
                                onChange={(e) => setSelectedMethod(e.target.value)}
                            />
                            <img
                                src={zaloImage}
                                alt="ZaloPay"
                                className="method-icon"
                                width={40}
                                height={40}
                            />
                            <span>ZaloPay</span>
                        </label>
                    </div>
                </div>

                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="pay-button"
                >
                    {loading ? <ClipLoader size={20} color="#fff" /> : 'Xác nhận thanh toán'}
                </button>
            </div>

            <Footer />
        </>
    );
};

export default PaymentPage;