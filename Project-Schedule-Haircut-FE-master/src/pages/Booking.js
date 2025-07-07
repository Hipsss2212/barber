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

const Booking = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // State initialization
    const [bookingData, setBookingData] = useState({
        services: location.state?.services || [],
        date: '',
        time: '',
        employees: [],
        selectedStylists: {
            haircut: null,
            spa: null
        }
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [hasSpaService, setHasSpaService] = useState(false);

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
        // Update state based on step data
        setBookingData(prev => ({
            ...prev,
            ...(stepData.employees && { employees: stepData.employees }),
            ...(stepData.selectedStylists && {
                selectedStylists: stepData.selectedStylists
            }),
            ...(stepData.date && { date: stepData.date }),
            ...(stepData.time && { time: stepData.time })
        }));

        // Update spa service flag if provided
        if (stepData.hasSpaService !== undefined) {
            setHasSpaService(stepData.hasSpaService);
        }

        // Move to next step
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleBookingComplete = () => {
        // Here you would typically send the booking data to your API
        console.log('Booking completed:', {
            services: bookingData.services,
            stylists: Object.values(bookingData.selectedStylists).filter(Boolean),
            date: bookingData.date,
            time: bookingData.time
        });

        // Redirect to confirmation page
        navigate('/booking-confirmation', {
            state: {
                bookingData: {
                    ...bookingData,
                    selectedStylists: Object.values(bookingData.selectedStylists).filter(Boolean)
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
                    setTime={(time) => setBookingData(prev => ({ ...prev, time }))}
                    onNext={() => handleNextStep({})}
                    onBack={handlePrevStep}
                    employees={Object.values(bookingData.selectedStylists).filter(Boolean)}
                    selectedDate={bookingData.date}
                />
            )
        },
        {
            title: 'Xác nhận',
            component: (
                <BookingConfirmation
                    services={bookingData.services}
                    stylists={Object.values(bookingData.selectedStylists).filter(Boolean)}
                    date={bookingData.date}
                    time={bookingData.time}
                    onBack={handlePrevStep}
                    onConfirm={handleBookingComplete}
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