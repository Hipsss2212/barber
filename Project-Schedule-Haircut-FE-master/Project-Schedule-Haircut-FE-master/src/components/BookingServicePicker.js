import React from 'react';
import BookingSummary from '../components/BookingSummary';
import '../assets/css/BookingServicePicker.css';
import useEmployeeService from '../services/employeeService';
import { ClipLoader } from 'react-spinners';

const BookingServicePicker = ({ services, onRemoveService, onNext }) => {
    const { getEmployees, isLoading, error } = useEmployeeService();

    const handleNext = async () => {
        try {
            const employees = await getEmployees();
            const hasSpaService = (services || []).some(
                service => service?.categoryType === "SPA"
            );
            onNext({ employees, hasSpaService });
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    return (
        <div className="booking-step">
            <h2>1. Chọn dịch vụ</h2>

            {services.length > 0 ? (
                <>
                    <BookingSummary
                        services={services}
                        onRemoveService={onRemoveService}
                    />
                    <button
                        className="btn-next"
                        onClick={handleNext}
                        disabled={services.length === 0 || isLoading}
                    >
                        {isLoading ? (
                            <>
                                <ClipLoader color="#ffffff" size={20} />
                                <span style={{ marginLeft: "8px" }}>Đang tải...</span>
                            </>
                        ) : (
                            "Tiếp theo"
                        )}
                    </button>

                </>
            ) : (
                <p className="no-services">Không có dịch vụ nào được chọn</p>
            )}
        </div>
    );
};

export default BookingServicePicker;