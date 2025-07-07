import React, { useState, useEffect } from "react";
import "../assets/css/Home.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../stores/slices/categorySlice';
import { fetchAllEmployees } from "../stores/slices/employeeSlice";
import AuthModal from "../components/AuthModal";
import useScrollAnimation from "../components/useScrollAnimation";

// Import images
import heroBanner from "../assets/image/banner.png";
import haircutService from "../assets/image/haircut.jpg";
import permService from "../assets/image/haircurl.jpg";
import dyeService from "../assets/image/haircolor.jpg";
import spaRelax from "../assets/image/spa1.jpg";
import shineBanner from "../assets/image/shine_banner.jpg";
import shine1 from "../assets/image/shine1.jpg";
import shine2 from "../assets/image/shine2.jpg";
import shine3 from "../assets/image/shine3.jpg";
import memberBanner from "../assets/image/image.png";

const Home = () => {
    const addToRefs = useScrollAnimation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(state => state.categories);
    const { employees } = useSelector(state => state.employees);

    useEffect(() => {
        dispatch(fetchAllCategories());
        dispatch(fetchAllEmployees());
    }, [dispatch]);

    // Lấy categories thực tế từ Redux store
    const haircutCategories = categories.filter(cat => cat.type === "HAIRCUT");
    const spaCategories = categories.filter(cat => cat.type === "SPA");

    // Map categories với dịch vụ hiển thị
    const haircutServices = [
        {
            id: 1,
            name: "Cắt tóc",
            image: haircutService,
            description: "Cắt tóc nam hiện đại với kỹ thuật chuyên nghiệp",
            icon: "✂️",
            categoryId: haircutCategories.find(cat => cat.name.toLowerCase().includes('cắt'))?.id
        },
        {
            id: 2,
            name: "Uốn tóc",
            image: permService,
            description: "Uốn định hình chuyên nam đầu tiên tại Việt Nam",
            icon: "🌀",
            categoryId: haircutCategories.find(cat => cat.name.toLowerCase().includes('uốn'))?.id
        },
        {
            id: 3,
            name: "Nhuộm tóc",
            image: dyeService,
            description: "Nhuộm tóc nam với màu sắc thời trang",
            icon: "🎨",
            categoryId: haircutCategories.find(cat => cat.name.toLowerCase().includes('nhuộm'))?.id
        }
    ];

    const stylists = employees.slice(0, 3).map(emp => ({
        id: emp.id,
        name: emp.name,
        avatar: emp.avatar || "https://via.placeholder.com/150",
        area: emp.area || "Khu vực trung tâm"
    }));

    // Hàm xử lý click cho các dịch vụ
    const handleServiceClick = (serviceName, categoryId) => {
        console.log(`Đã chọn dịch vụ: ${serviceName}, categoryId: ${categoryId}`);
        
        if (categoryId) {
            // Chuyển hướng đến trang chi tiết dịch vụ
            window.location.href = `/detail/${categoryId}`;
        } else {
            // Nếu không tìm thấy categoryId, hiển thị toast
            setToastMessage(`Đang cập nhật dịch vụ: ${serviceName}`);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleSpaClick = () => {
        console.log('Đã chọn dịch vụ Spa & Massage');
        const spaCategoryId = spaCategories[0]?.id;
        
        if (spaCategoryId) {
            window.location.href = `/detail/${spaCategoryId}`;
        } else {
            setToastMessage('Đang cập nhật dịch vụ Spa & Massage');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleMemberClick = () => {
        console.log('Đã chọn tham gia Shine Member');
        setToastMessage('Đã chọn tham gia Shine Member');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        // window.location.href = '/shine-member';
    };

    const handleShineCollectionClick = (collectionName) => {
        console.log(`Đã chọn collection: ${collectionName}`);
        setToastMessage(`Đã chọn collection: ${collectionName}`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        // window.location.href = `/shine-collection/${collectionName.toLowerCase().replace(/\s+/g, '-')}`;
    };

    return (
        <div className="home-root">
            <Header />

            {/* 1. Hero Section */}
            <section className="home-hero" ref={addToRefs}>
                <img src={heroBanner} alt="Boss Barber Hero" className="home-hero-bg" />
                <div className="home-hero-overlay" />
                <div className="home-hero-content">
                    <div className="home-hero-badge">
                        <span>🔥 RA MẮT CÔNG NGHỆ UỐN ĐỊNH HÌNH CHUYÊN NAM ĐẦU TIÊN TẠI VIỆT NAM</span>
                    </div>
                    <h1 className="home-hero-title">BOSS BARBER</h1>
                    <p className="home-hero-subtitle">Nơi phong cách bắt đầu - Nơi nam giới tỏa sáng</p>
                    <button className="home-hero-cta" onClick={() => window.location.href='/booking'}>
                        Đặt lịch ngay
                    </button>
                </div>
            </section>

            {/* 2. Dịch vụ tóc */}
            <section className="home-services animate-in" ref={addToRefs}>
                <div className="home-section-container">
                    <div className="home-section-header">
                        <h2>DỊCH VỤ TÓC</h2>
                        <p>Chuyên nghiệp - Hiện đại - Cá nhân hóa</p>
                    </div>
                    <div className="home-services-grid">
                        {haircutServices.map((service, index) => (
                            <div className="home-service-card" key={service.id} onClick={() => handleServiceClick(service.name, service.categoryId)}>
                                <div className="home-service-icon">{service.icon}</div>
                                <div className="home-service-image">
                                    <img src={service.image} alt={service.name} />
                                </div>
                                <div className="home-service-content">
                                    <h3>{service.name}</h3>
                                    <p>{service.description}</p>
                                    <button className="home-service-btn" onClick={(e) => {
                                        e.stopPropagation();
                                        handleServiceClick(service.name, service.categoryId);
                                    }}>
                                        Tìm hiểu thêm →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Spa & Relax */}
            <section className="home-spa animate-in" ref={addToRefs}>
                <div className="home-section-container">
                    <div className="home-spa-card" onClick={handleSpaClick}>
                        <div className="home-spa-image">
                            <img src={spaRelax} alt="Spa & Massage Relax" />
                        </div>
                        <div className="home-spa-content">
                            <div className="home-spa-badge">💆‍♂️</div>
                            <h2>Spa & Massage Relax</h2>
                            <p>Xua tan căng thẳng với dịch vụ massage đầu, gội đầu thư giãn chuyên nghiệp</p>
                            <button className="home-spa-btn" onClick={(e) => {
                                e.stopPropagation();
                                handleSpaClick();
                            }}>
                                Trải nghiệm ngay →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SHINE COLLECTION */}
            <section className="home-shine animate-in" ref={addToRefs}>
                <div className="home-section-container">
                    <div className="home-section-header">
                        <h2>SHINE COLLECTION</h2>
                        <p>VIBE NÀO CŨNG TỎA SÁNG</p>
                    </div>
                    <div className="home-shine-grid">
                        <div className="home-shine-main" onClick={() => handleShineCollectionClick('AW 25-26')}>
                            <img src={shineBanner} alt="SHINE COLLECTION Main" />
                            <div className="home-shine-overlay">
                                <h3>AW 25-26</h3>
                                <p>Xu hướng tóc nam mới nhất</p>
                            </div>
                        </div>
                        <div className="home-shine-items">
                            <div className="home-shine-item" onClick={() => handleShineCollectionClick('Ready for new game')}>
                                <img src={shine1} alt="Ready for new game" />
                                <div className="home-shine-item-overlay">
                                    <h4>Ready for new game</h4>
                                </div>
                            </div>
                            <div className="home-shine-item" onClick={() => handleShineCollectionClick('Anh trai say hair')}>
                                <img src={shine2} alt="Anh trai say hair" />
                                <div className="home-shine-item-overlay">
                                    <h4>Anh trai say hair</h4>
                                </div>
                            </div>
                            <div className="home-shine-item" onClick={() => handleShineCollectionClick('Bad Boy')}>
                                <img src={shine3} alt="Bad Boy" />
                                <div className="home-shine-item-overlay">
                                    <h4>Bad Boy</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Stylist */}
            <section className="home-stylists animate-in" ref={addToRefs}>
                <div className="home-section-container">
                    <div className="home-section-header">
                        <h2>ĐỘI NGŨ STYLIST</h2>
                        <p>Chuyên nghiệp - Kinh nghiệm - Tận tâm</p>
                    </div>
                    <div className="home-stylists-grid">
                        {stylists.map((stylist, index) => (
                            <div className="home-stylist-card" key={stylist.id}>
                                <div className="home-stylist-avatar">
                                    <img src={stylist.avatar} alt={stylist.name} />
                                </div>
                                <div className="home-stylist-info">
                                    <h3>{stylist.name}</h3>
                                    <p>{stylist.area}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Shine Member */}
            <section className="home-member animate-in" ref={addToRefs}>
                <div className="home-section-container">
                    <div className="home-member-card">
                        <div className="home-member-content">
                            <div className="home-member-badge">👑</div>
                            <h2>SHINE MEMBER</h2>
                            <p>Tham gia chương trình thành viên để nhận những ưu đãi đặc biệt và quyền lợi vượt trội</p>
                            <ul className="home-member-benefits">
                                <li>🎯 Giảm giá 10-20% cho mọi dịch vụ</li>
                                <li>⚡ Ưu tiên đặt lịch không cần chờ</li>
                                <li>🎁 Tặng quà sinh nhật đặc biệt</li>
                                <li>💎 Tích điểm đổi quà hấp dẫn</li>
                            </ul>
                            <button className="home-member-btn" onClick={handleMemberClick}>
                                Tham gia ngay →
                            </button>
                        </div>
                        <div className="home-member-image">
                            <img src={memberBanner} alt="Shine Member" />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <AuthModal />
            
            {/* Toast Notification */}
            {showToast && (
                <div className="home-toast">
                    <div className="home-toast-content">
                        <span className="home-toast-icon">✅</span>
                        <span className="home-toast-message">{toastMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;