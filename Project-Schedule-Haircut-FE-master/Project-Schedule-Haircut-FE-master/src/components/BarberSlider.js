import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "../assets/css/BarberSlider.css";

const BarberSlider = ({ barbers }) => {
    const filteredBarbers = barbers.filter((barber) => barber.type === 0);

    return (
        <div className="barber-slider">
            {/* <h2>Đội ngũ Stylist dày dặn kinh nghiệm</h2> */}
            <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={3}
                navigation
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
            >
                {filteredBarbers.map((barber) => (
                    <SwiperSlide key={barber.id} className="barber-slide">
                        <div className="barber-card">
                            <div className="barber-image-container">
                                <img
                                    src={barber.avatar}
                                    alt={barber.fullName}
                                    className="barber-image"
                                />
                            </div>
                            <div className="barber-content">
                                <h3>{barber.fullName}</h3>
                                <p>{barber.address}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default BarberSlider;
