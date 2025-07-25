import { FaCut, FaTimes } from 'react-icons/fa';
import '../assets/css/BookingSummary.css'; // Import your CSS file

const BookingSummary = ({ services, onRemoveService, couponCode, couponDiscount, hideTotal }) => {
    const total = services.reduce((sum, item) => sum + item.price, 0);
    const totalAfterDiscount = couponDiscount ? total - (total * couponDiscount / 100) : total;
    return (
        <div className="booking-summary-container">
            <div className="booking-summary-header">
                <FaCut className="booking-summary-icon" />
                <span>Đã chọn {services.length} dịch vụ</span>
            </div>
            <div className="selected-services-container">
                {services.map((s, index) => (
                    <button
                        key={index}
                        className="service-chip"
                    >
                        {s.name}
                        <FaTimes
                            style={{ marginLeft: '5px', cursor: 'pointer', color: 'black', fontSize: '12px' }}
                            onClick={() => onRemoveService(index)}
                        />
                    </button>
                ))}
            </div>
            {couponCode && couponDiscount > 0 && (
                <div className="booking-summary-coupon">
                    <span>Mã giảm giá: <b>{couponCode}</b> (Giảm {couponDiscount * 100}%)</span>
                </div>
            )}
            {!hideTotal && (
                <p className="booking-summary-total">
                    Tổng số tiền anh cần thanh toán:
                    <span className="booking-summary-amount"> {totalAfterDiscount} VNĐ</span>
                    {couponDiscount > 0 && <span className="booking-summary-discount"> (Đã giảm {couponDiscount * 100}%)</span>}
                </p>
            )}
        </div>
    );
};

export default BookingSummary;