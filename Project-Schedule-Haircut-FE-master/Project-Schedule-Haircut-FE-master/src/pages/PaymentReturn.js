import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../assets/css/PaymentReturn.css'; // Đường dẫn đến file CSS của bạn
import Header from '../components/Header';
import Footer from '../components/Footer';

const PaymentReturn = () => {
    const [searchParams] = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState('checking');
    const [paymentDetails, setPaymentDetails] = useState({});

    useEffect(() => {
        const status = searchParams.get('status');
        const transactionId = searchParams.get('transactionId');
        const amount = searchParams.get('amount');

        const processPayment = () => {
            if (!status) {
                toast.error('Không thể xác định trạng thái thanh toán');
                return;
            }

            setPaymentStatus(status);
            setPaymentDetails({
                amount: amount ? (parseInt(amount) / 100).toLocaleString() + ' VNĐ' : 'N/A',
                transactionId: transactionId || 'N/A',
            });
        };

        processPayment();
    }, [searchParams]);

    const renderContent = () => {
        switch (paymentStatus) {
            case 'success':
                return (
                    <div className="payment-success">
                        <div className="success-icon">✅</div>
                        <h1 className="success-title">Thanh Toán Thành Công</h1>

                        <div className="payment-details">
                            <div className="detail-row">
                                <span className="detail-label">Mã giao dịch:</span>
                                <span className="detail-value">{paymentDetails.transactionId}</span>
                            </div>

                            <div className="detail-row">
                                <span className="detail-label">Số tiền:</span>
                                <span className="detail-value amount">{paymentDetails.amount}</span>
                            </div>
                        </div>

                        <div className="success-actions">
                            <button
                                className="action-button print"
                                onClick={() => window.print()}
                            >
                                In hóa đơn
                            </button>
                            <button
                                className="action-button history"
                                onClick={() => window.location.href = '/booking-history'}
                            >
                                Xem lịch sử
                            </button>
                        </div>
                    </div>
                );

            case 'error':
                return (
                    <div className="payment-error">
                        <div className="error-icon">❌</div>
                        <h1 className="error-title">Thanh Toán Thất Bại</h1>

                        <div className="error-message">
                            Mã lỗi: {paymentDetails.errorCode || 'Không xác định'}
                        </div>

                        <div className="error-actions">
                            <button
                                className="action-button retry"
                                onClick={() => window.location.href = '/payment'}
                            >
                                Thử lại
                            </button>
                            <button
                                className="action-button support"
                                onClick={() => window.location.href = '/support'}
                            >
                                Hỗ trợ
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="payment-processing">
                        <div className="loader"></div>
                        <p>Đang xác thực giao dịch...</p>
                    </div>
                );
        }
    };

    return (
        <>
            <Header />
            <div className="payment-return-container">
                {renderContent()}
            </div>
            <Footer />
        </>
    );
};

export default PaymentReturn;