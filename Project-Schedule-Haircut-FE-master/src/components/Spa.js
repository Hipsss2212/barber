import React from "react";
import { useNavigate } from "react-router-dom";

const SpaServices = ({ services, loading, error }) => {
    const navigate = useNavigate();

    const handleServiceClick = (serviceId) => {
        navigate(`/detail/${serviceId}`);
    };
    return (
        <section className="spa-relax">
            <div className="title-wrapper">
                <h2>SPA & RELAX</h2>
            </div>
            <div className="spa-list">
                {services.map((service) => (
                    <div className="spa-item" key={service.id} onClick={() => handleServiceClick(service.id)} style={{ cursor: 'pointer' }}>
                        <a href={service.link}>
                            <img src={service.image} alt={service.name} />
                        </a>
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

export default SpaServices;