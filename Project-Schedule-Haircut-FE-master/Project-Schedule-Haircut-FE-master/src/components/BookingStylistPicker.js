import React, { useState } from 'react';
import '../assets/css/BookingStylistPicker.css';
import { toast } from 'react-toastify';

const BookingStylistPicker = ({ onNext, onBack, employees = [], hasSpaService = false, hasHaircutService = false }) => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [selectedStylists, setSelectedStylists] = useState({
        haircut: null,
        spa: null
    });

    const haircutStylists = hasHaircutService ? employees.filter(st => st?.type === 0) : [];
    const spaStylists = hasSpaService ? employees.filter(st => st?.type === 1) : [];

    // Kiểm tra xem có cần hiển thị phần chọn nhân viên không
    const showHaircutSection = hasHaircutService && haircutStylists.length > 0;
    const showSpaSection = hasSpaService && spaStylists.length > 0;

    const handleSelectStylist = (type, selected) => {
        setSelectedStylists(prev => ({
            ...prev,
            [type]: selected
        }));
        setActiveDropdown(null);
    };

    const toggleDropdown = (type) => {
        if ((type === 'spa' && !hasSpaService) || (type === 'haircut' && !hasHaircutService)) return;
        setActiveDropdown(activeDropdown === type ? null : type);
    };

    const handleNext = () => {
        // Kiểm tra điều kiện trước khi next
        const haircutValid = !hasHaircutService || selectedStylists.haircut;
        const spaValid = !hasSpaService || selectedStylists.spa;

        if (haircutValid && spaValid) {
            onNext({ selectedStylists });
        } else {
            toast.error('Vui lòng chọn đầy đủ nhân viên cho các dịch vụ');
        }
    };

    const isNextDisabled =
        (hasHaircutService && !selectedStylists.haircut) ||
        (hasSpaService && !selectedStylists.spa);

    return (
        <div className="stylist-picker-container">
            <h2 className="stylist-picker-title">2. Chọn Stylist</h2>

            {/* Dropdown cho thợ cắt tóc */}
            {showHaircutSection ? (
                <div className="stylist-category">
                    <h3>Thợ cắt tóc</h3>
                    <div className="stylist-selector">
                        <div
                            className="selector-toggle"
                            onClick={() => toggleDropdown('haircut')}
                        >
                            <span className="selector-placeholder">
                                {selectedStylists.haircut ? selectedStylists.haircut.fullName : 'Chọn thợ cắt tóc'}
                            </span>
                            <span className={`dropdown-arrow ${activeDropdown === 'haircut' ? 'open' : ''}`}>
                                ▼
                            </span>
                        </div>

                        {activeDropdown === 'haircut' && (
                            <div className="stylist-list">
                                {haircutStylists.map(st => (
                                    <div
                                        key={st.id}
                                        className={`stylist-option ${selectedStylists.haircut?.id === st.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectStylist('haircut', st)}
                                    >
                                        <img src={st.avatar} alt={st.fullName} className="option-avatar" />
                                        <div className="option-info">
                                            <div className="option-name">{st.fullName}</div>
                                            <div className="option-specialty">{st.address}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : hasHaircutService ? (
                <div className="no-stylist-message">
                    <i className="info-icon">ℹ️</i> Hiện không có thợ cắt tóc nào khả dụng
                </div>
            ) : null}

            {/* Dropdown cho thợ spa */}
            {showSpaSection ? (
                <div className="stylist-category">
                    <h3>Thợ spa</h3>
                    <div className="stylist-selector">
                        <div
                            className="selector-toggle"
                            onClick={() => toggleDropdown('spa')}
                        >
                            <span className="selector-placeholder">
                                {selectedStylists.spa ? selectedStylists.spa.fullName : 'Chọn thợ spa'}
                            </span>
                            <span className={`dropdown-arrow ${activeDropdown === 'spa' ? 'open' : ''}`}>
                                ▼
                            </span>
                        </div>

                        {activeDropdown === 'spa' && (
                            <div className="stylist-list">
                                {spaStylists.map(st => (
                                    <div
                                        key={st.id}
                                        className={`stylist-option ${selectedStylists.spa?.id === st.id ? 'selected' : ''}`}
                                        onClick={() => handleSelectStylist('spa', st)}
                                    >
                                        <img src={st.avatar} alt={st.fullName} className="option-avatar" />
                                        <div className="option-info">
                                            <div className="option-name">{st.fullName}</div>
                                            <div className="option-specialty">{st.address}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : hasSpaService ? (
                <div className="no-stylist-message">
                    <i className="info-icon">ℹ️</i> Hiện không có thợ spa nào khả dụng
                </div>
            ) : (
                <div className="spa-notice">
                    <i className="info-icon">ℹ️</i> Bạn không có dịch vụ spa nào trong đơn đặt lịch
                </div>
            )}

            <div className="navigation-buttons">
                <button className="nav-button back-button-stylist-picker" onClick={onBack}>
                    Quay lại
                </button>
                <button
                    className="nav-button next-button"
                    onClick={handleNext}
                    disabled={isNextDisabled}
                >
                    Tiếp theo
                </button>
            </div>
        </div>
    );
};

export default BookingStylistPicker;