import { FaCut, FaTimes } from 'react-icons/fa';
import '../assets/css/BookingSummary.css'; // Import your CSS file

const BookingSummary = ({ services, onRemoveService }) => {
    const total = services.reduce((sum, item) => sum + item.price, 0);

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

            <p className="booking-summary-total">
                Tổng số tiền anh cần thanh toán:
                <span className="booking-summary-amount"> {total} VNĐ</span>
            </p>
        </div>
    );
};

export default BookingSummary;