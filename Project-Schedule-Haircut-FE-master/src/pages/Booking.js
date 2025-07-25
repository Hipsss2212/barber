import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingServiceStep from '../components/BookingServicePicker';
import BookingStylistStep from '../components/BookingStylistPicker';
import BookingDateStep from '../components/BookingDatePicker';
import BookingTimeStep from '../components/BookingTimePicker';
import BookingConfirmation from '../components/BookingConfirmation';
import '../assets/css/Booking.css';
import { parse, format } from 'date-fns';

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State initialization
    const [bookingData, setBookingData] = useState({
        services: location.state?.services || [],
        date: '',
        time: {}, // Change from string to object: {haircut: '09:00', spa: '09:30'}
        employees: [],
        selectedStylists: {
            haircut: null,
            spa: null
        }
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [hasSpaService, setHasSpaService] = useState(false);
    const [couponCode, setCouponCode] = useState(location.state?.couponCode || '');
    const [couponDiscount, setCouponDiscount] = useState(location.state?.couponDiscount || 0);

    // Check for spa services on initial load
    useEffect(() => {
        const spaServiceExists = bookingData.services.some(
            service => service.categoryType === "SPA"
        );
        setHasSpaService(spaServiceExists);
    }, [bookingData.services]);

    // Handlers
    const handleRemoveService = (indexToRemove) => {
        setBookingData(prev => ({
            ...prev,
            services: prev.services.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleNextStep = (stepData) => {
        setBookingData(prev => ({
            ...prev,
            ...(stepData.employees && { employees: stepData.employees }),
            ...(stepData.selectedStylists && {
                selectedStylists: stepData.selectedStylists
            }),
            ...(stepData.date && { date: stepData.date }),
            ...(stepData.time && { time: { ...prev.time, ...stepData.time } }) // Merge per-service time
        }));
        if (stepData.hasSpaService !== undefined) {
            setHasSpaService(stepData.hasSpaService);
        }
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleBookingComplete = () => {
        // Gửi bookingData + couponCode vào API đặt lịch
        console.log('Booking completed:', {
            services: bookingData.services,
            stylists: bookingData.selectedStylists,
            date: bookingData.date,
            time: bookingData.time,
            couponCode,
            couponDiscount
        });
        // TODO: Gọi API đặt lịch ở đây, truyền couponCode
        // Redirect to confirmation page
        navigate('/booking-confirmation', {
            state: {
                bookingData: {
                    ...bookingData,
                    selectedStylists: bookingData.selectedStylists,
                    couponCode,
                    couponDiscount
                }
            }
        });
    };

    // Steps configuration
    const steps = [
        {
            title: 'Chọn dịch vụ',
            component: (
                <BookingServiceStep
                    services={bookingData.services}
                    onRemoveService={handleRemoveService}
                    onNext={handleNextStep}
                    couponCode={couponCode}
                    couponDiscount={couponDiscount}
                    hideTotal={couponDiscount > 0}
                />
            )
        },
        {
            title: 'Chọn stylist',
            component: (
                <BookingStylistStep
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                    employees={bookingData.employees}
                    hasSpaService={hasSpaService}
                    hasHaircutService={bookingData.services.some(
                        service => service?.categoryType === "HAIRCUT"
                    )}
                />
            )
        },
        {
            title: 'Chọn ngày',
            component: (
                <BookingDateStep
                    selectedDate={bookingData.date}
                    onSelect={(date) => setBookingData(prev => ({ ...prev, date }))}
                    onNext={() => handleNextStep({})}
                    onBack={handlePrevStep}
                />
            )
        },
        {
            title: 'Chọn giờ',
            component: (
                <BookingTimeStep
                    time={bookingData.time}
                    setTime={(timeObj) => setBookingData(prev => ({ ...prev, time: { ...prev.time, ...timeObj } }))}
                    onNext={() => handleNextStep({})}
                    onBack={handlePrevStep}
                    employees={bookingData.selectedStylists}
                    selectedDate={bookingData.date}
                />
            )
        },
        {
            title: 'Xác nhận',
            component: (
                <BookingConfirmation
                    services={bookingData.services}
                    stylists={bookingData.selectedStylists}
                    date={bookingData.date && /^\d{4}-\d{2}-\d{2}$/.test(bookingData.date)
                        ? bookingData.date
                        : (bookingData.date ? format(
                            typeof bookingData.date === 'string' && bookingData.date.includes('-') && bookingData.date.trim().length === 14
                                ? parse(bookingData.date, 'dd - MM - yyyy', new Date())
                                : new Date(bookingData.date),
                            'yyyy-MM-dd'
                        ) : '')}
                    time={bookingData.time}
                    onBack={handlePrevStep}
                    onConfirm={handleBookingComplete}
                    couponDiscount={couponDiscount}
                    couponCode={couponCode}
                />
            )
        }
    ];

    return (
        <>
            <Header />
            <div className="booking-container">
                <h1>ĐẶT LỊCH GIỮ CHỖ</h1>

                {/* Progress indicator */}
                <div className="booking-steps">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`step-indicator ${currentStep > index + 1 ? 'completed' : ''
                                } ${currentStep === index + 1 ? 'active' : ''
                                }`}
                        >
                            <div className="step-number">{index + 1}</div>
                            <div className="step-title">{step.title}</div>
                        </div>
                    ))}
                </div>

                {/* Tổng tiền và giảm giá ở bước 1 */}
                {currentStep === 1 && (
                    <div style={{ margin: '16px 0' }}>
                        {(() => {
                            const total = bookingData.services.reduce((sum, item) => sum + item.price, 0);
                            if (couponDiscount && couponDiscount > 0) {
                                const discountAmount = total * couponDiscount;
                                const finalTotal = total - discountAmount;
                                return (
                                    <>
                                        <div style={{ color: '#1677ff', fontWeight: 500 }}>
                                            Đã giảm: -{discountAmount.toLocaleString()} VNĐ ({couponDiscount * 100}%)
                                        </div>
                                        <div style={{ color: 'green', fontWeight: 700 }}>
                                            Tổng số tiền anh cần thanh toán: {finalTotal.toLocaleString()} VNĐ
                                        </div>
                                    </>
                                );
                            } else {
                                return (
                                    <div style={{ color: 'green', fontWeight: 700 }}>
                                        Tổng số tiền anh cần thanh toán: {total.toLocaleString()} VNĐ
                                    </div>
                                );
                            }
                        })()}
                    </div>
                )}

                {/* Current step content */}
                <div className="booking-content">
                    {steps[currentStep - 1].component}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Booking;