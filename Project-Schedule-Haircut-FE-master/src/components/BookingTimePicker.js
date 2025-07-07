// src/components/BookingTimePicker.js
import React, { useEffect, useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import useTimeService from '../services/timeService';
import '../assets/css/BookingTimePicker.css';

const BookingTimePicker = ({ time, setTime, onNext, onBack, employees, selectedDate }) => {
    const { getTimesByEmployee, getCombinedTimes, loading } = useTimeService();
    const [availableTimes, setAvailableTimes] = useState([]);
    const prevEmployees = useRef([]);
    const prevDate = useRef('');

    useEffect(() => {
        const employeeIds = employees?.map(e => e.id).join(',') || '';
        const dateStr = selectedDate || '';

        // Check if actual data changed
        const employeesChanged = employeeIds !== prevEmployees.current.join(',');
        const dateChanged = dateStr !== prevDate.current;

        if (!employeesChanged && !dateChanged) return;

        prevEmployees.current = employees?.map(e => e.id) || [];
        prevDate.current = dateStr;

        const fetchAvailableTimes = async () => {
            try {
                if (!employees?.length || !selectedDate) {
                    setAvailableTimes([]);
                    return;
                }

                let times = [];
                if (employees.length === 1) {
                    const rawTimes = await getTimesByEmployee(employees[0].id, selectedDate);
                    times = rawTimes.filter(t => t.isBusy === 0);
                } else {
                    times = await getCombinedTimes(employees.map(e => e.id), selectedDate);
                }

                setAvailableTimes(times);
            } catch (error) {
                console.error('Error fetching available times:', error);
                setAvailableTimes([]);
            }
        };

        fetchAvailableTimes();
    }, [employees, selectedDate, getTimesByEmployee, getCombinedTimes]);


    return (
        <div className="booking-step">
            <h2>4. Chọn giờ</h2>

            {loading ? (
                <div className="loading-container-time-picker">
                    <ClipLoader color="#0A2A7C" size={35} />
                    <p>Đang tải khung giờ...</p>
                </div>
            ) : (
                <>
                    <div className="time-slots">
                        {availableTimes.map(slot => (
                            <button
                                key={slot.timeName}
                                className={`time-slot ${time === slot.timeName ? 'active' : ''}`}
                                onClick={() => setTime(slot.timeName)}
                                disabled={loading}
                            >
                                {slot.timeName}
                            </button>
                        ))}
                        {availableTimes.length === 0 && !loading && (
                            <p className="no-times">Không có khung giờ trống</p>
                        )}
                    </div>

                    {time && (
                        <div className="selected-time">
                            Bạn đã chọn: <strong>{time}</strong>
                        </div>
                    )}
                </>
            )}

            <div className="navigation-buttons">
                <button
                    className="nav-button back-button-time-picker"
                    onClick={onBack}
                    disabled={loading}
                >
                    Quay lại
                </button>
                <button
                    className="nav-button next-button"
                    onClick={onNext}
                    disabled={!time || loading}
                >
                    {loading ? <ClipLoader color="#fff" size={20} /> : 'Tiếp theo'}
                </button>
            </div>
        </div>
    );
};

export default BookingTimePicker;