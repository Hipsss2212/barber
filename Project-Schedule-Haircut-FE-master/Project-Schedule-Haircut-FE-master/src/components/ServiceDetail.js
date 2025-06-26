import React from "react";
import "../assets/css/ServiceDetail.css";
import useCartService from "../services/cartService";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { showAuthModal } from "../stores/slices/actionFormSlice";
import AuthModal from "./AuthModal";

const ServiceDetail = ({ title, subtitle, services, combos }) => {
    const { addCombo, addService } = useCartService();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const [loadingId, setLoadingId] = React.useState(null);
    const dispatch = useDispatch();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    // Hàm xử lý chung cho cả service và combo
    const handleAddItem = async (type, id, addFunction) => {
        if (!isAuthenticated) {
            dispatch(showAuthModal({ form: 'login' }));
            return;
        }

        try {
            setLoadingId(`${type}-${id}`);
            const request = { [`${type}Id`]: id };
            const success = await addFunction(request);
            if (success) {
                toast.success(`Đã thêm ${type === 'service' ? 'dịch vụ' : 'combo'} vào giỏ hàng`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <section className="service-detail">
            <h2 className="service-title">{title}</h2>
            <p className="service-subtitle">{subtitle}</p>

            <div className="service-section">
                <h3 className="section-title">Dịch vụ đơn lẻ</h3>
                <div className="service-list-main">
                    {services.map((service) => (
                        <div key={service.id} className="service-card">
                            <div className="service-image-container-main">
                                <img
                                    src={service.image || "/default-service.jpg"}
                                    alt={service.name}
                                    onError={(e) => {
                                        e.target.src = "/default-service.jpg";
                                    }}
                                />
                            </div>
                            <div className="service-info">
                                <h4>{service.name}</h4>
                                <div className="service-meta">
                                    <span className="price">{formatPrice(service.price)}</span>
                                    <span className="time">{service.haircutTime} phút</span>
                                </div>
                            </div>
                            <div className="service-footer">
                                <span className="time-badge">{service.haircutTime} phút</span>
                                <button
                                    className="expand-btn"
                                    onClick={() => handleAddItem('service', service.id, addService)}
                                    disabled={!!loadingId} // Disable tất cả khi có bất kỳ item nào đang loading
                                    aria-label={`Thêm ${service.name} vào giỏ hàng`}
                                >
                                    {loadingId === `service-${service.id}` ? (
                                        <ClipLoader
                                            color="#004AAD"
                                            size={15}
                                            margin={2}
                                            loading
                                        />
                                    ) : (
                                        "+"
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="service-section">
                <h3 className="section-title">Combo dịch vụ</h3>
                <div className="combo-list">
                    {combos.map((combo) => (
                        <div key={combo.id} className="combo-card">
                            <div className="combo-image-container">
                                <img
                                    src={combo.image || "/default-combo.jpg"}
                                    alt={combo.name}
                                    onError={(e) => {
                                        e.target.src = "/default-combo.jpg";
                                    }}
                                />
                            </div>
                            <div className="combo-info">
                                <h3>{combo.name}</h3>
                                <div className="combo-meta">
                                    <span className="price">{formatPrice(combo.price)}</span>
                                    <span className="time">{combo.haircutTime} phút</span>
                                </div>
                            </div>
                            <div className="combo-footer">
                                <span className="time-badge">{combo.haircutTime} phút</span>
                                <button
                                    className="expand-btn"
                                    onClick={() => handleAddItem('combo', combo.id, addCombo)}
                                    disabled={!!loadingId} // Disable tất cả khi có bất kỳ item nào đang loading
                                    aria-label={`Thêm ${combo.name} vào giỏ hàng`}
                                >
                                    {loadingId === `combo-${combo.id}` ? (
                                        <ClipLoader
                                            color="#004AAD"
                                            size={15}
                                            margin={2}
                                            loading
                                        />
                                    ) : (
                                        "+"
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AuthModal />
        </section>
    );
};

export default ServiceDetail;
