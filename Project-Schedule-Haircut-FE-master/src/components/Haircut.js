import React from "react";
import { useNavigate } from "react-router-dom";

const Haircut = ({ services, loading, error }) => {
    const navigate = useNavigate();

    const handleServiceClick = (serviceId) => {
        navigate(`/detail/${serviceId}`);
    };


    return (
        <section className="services">
            <div className="title-wrapper">
                <h2>DỊCH VỤ TÓC</h2>
            </div>
            <div className="service-list">
                {services.map((service) => (
                    <div
                        className="service-item"
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        style={{ cursor: 'pointer' }}
                    > 
                        <div className="service-image-container">
                            <img src={service.image} alt={service.name} />
                        </div>
                        <h3>{service.name}</h3>
                        <div
                            className="learn-more"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleServiceClick(service.id);
                            }}
                        >
                            Tìm hiểu thêm →
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Haircut;