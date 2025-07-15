// src/components/BookingTimePicker.js
import React, { useEffect, useState, useRef } from 'react';
import { ClipLoader } from 'react-spinners';
import useTimeService from '../services/timeService';
import '../assets/css/BookingTimePicker.css';
import { format, parseISO } from 'date-fns';

const BookingTimePicker = ({ time, setTime, onNext, onBack, employees, selectedDate }) => {
    const { getTimesByEmployee, loading } = useTimeService();
    const [availableTimes, setAvailableTimes] = useState({}); // {haircut: [...], spa: [...]}
    const [autoSelected, setAutoSelected] = useState(false);

    useEffect(() => {
        const fetchAllTimes = async () => {
            if (!employees || !selectedDate) return;
            const result = {};
            // Chuyển selectedDate yyyy-MM-dd về dd - MM - yyyy cho API getTimesByEmployee
            let dateForApi = selectedDate;
            if (/^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
                const d = parseISO(selectedDate);
                dateForApi = format(d, 'dd - MM - yyyy');
            }
            for (const [type, emp] of Object.entries(employees)) {
                if (emp && emp.id) {
                    const rawTimes = await getTimesByEmployee(emp.id, dateForApi);
                    result[type] = rawTimes.filter(t => t.isBusy === 0);
                }
            }
            setAvailableTimes(result);
        };
        fetchAllTimes();
        setAutoSelected(false);
    }, [employees, selectedDate, getTimesByEmployee]);

    // Auto-select earliest slot for each service if not already selected
    useEffect(() => {
        if (!autoSelected && Object.keys(availableTimes).length > 0) {
            const newTime = { ...time };
            let changed = false;
            for (const [type, slots] of Object.entries(availableTimes)) {
                if (!time[type] && slots.length > 0) {
                    newTime[type] = slots[0].timeName;
                    changed = true;
                }
            }
            if (changed) {
                setTime(newTime);
            }
            setAutoSelected(true);
        }
    }, [availableTimes, time, setTime, autoSelected]);

    return (
        <div className="booking-step">
            <h2>4. Chọn giờ cho từng dịch vụ</h2>
            {Object.entries(employees).map(([type, emp]) => (
                <div key={type} className="service-time-section">
                    <h3>{type === 'haircut' ? 'Cắt tóc' : 'Spa'} - {emp?.fullName || ''}</h3>
                    <div className="time-slots">
                        {(availableTimes[type] || []).map(slot => (
                            <button
                                key={slot.timeName}
                                className={`time-slot ${time[type] === slot.timeName ? 'active' : ''}`}
                                onClick={() => setTime({ ...time, [type]: slot.timeName })}
                                disabled={loading}
                            >
                                {slot.timeName}
                            </button>
                        ))}
                        {(availableTimes[type]?.length === 0 && !loading) && (
                            <p className="no-times">Không có khung giờ trống</p>
                        )}
                    </div>
                    {time[type] && (
                        <div className="selected-time">
                            Đã chọn: <strong>{time[type]}</strong>
                        </div>
                    )}
                </div>
            ))}
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
                    onClick={() => onNext({ time })}
                    disabled={
                        Object.entries(employees)
                            .filter(([type, emp]) => emp && emp.id)
                            .some(([type]) => !time[type]) || loading
                    }
                >
                    {loading ? <ClipLoader color="#fff" size={20} /> : 'Tiếp theo'}
                </button>
            </div>
        </div>
    );
};

export default BookingTimePicker;