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

const heroImages = [
  "https://baogiaothong.mediacdn.vn/603483875699699712/2024/7/3/anh-trai-say-hi-17200028132131457244451.jpeg",
  "https://kenh14cdn.com/203336854389633024/2024/6/25/edit-img9335-1719321309667109840988.jpeg",
  "https://thegioidienanh.vn/stores/news_dataimages/2024/092024/15/12/atsh-eps14-tiet-muc-team-hieuthuhai-1120240915124020.jpg?rt=20240915124827"
];

const Home = () => {
    const addToRefs = useScrollAnimation();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [heroIndex, setHeroIndex] = useState(0);
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector(state => state.categories);
    const { employees } = useSelector(state => state.employees);

    // Auto slide hero images
    useEffect(() => {
      const interval = setInterval(() => {
        setHeroIndex(idx => (idx + 1) % heroImages.length);
      }, 4000);
      return () => clearInterval(interval);
    }, []);

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
            image: "https://static2.vieon.vn/vieplay-image/poster_v4/2024/05/31/jz7auhmf_660x946-atsh-thumb-ducphuc.png",
            description: "Cắt tóc nam hiện đại với kỹ thuật chuyên nghiệp",
            icon: "✂️",
            categoryId: haircutCategories.find(cat => cat.name.toLowerCase().includes('cắt'))?.id
        },
        {
            id: 2,
            name: "Uốn tóc",
            image: "https://static2.vieon.vn/vieplay-image/poster_v4/2024/06/06/vr9uom33_660x946-atsh-thumb-captain6c186cdc806f75c8426fd40ef8e148d6.png",
            description: "Uốn định hình chuyên nam đầu tiên tại Việt Nam",
            icon: "🌀",
            categoryId: haircutCategories.find(cat => cat.name.toLowerCase().includes('uốn'))?.id
        },
        {
            id: 3,
            name: "Nhuộm tóc",
            image:"https://static2.vieon.vn/vieplay-image/poster_v4/2024/06/06/9fvomnzv_660x946-atsh-thumb-phapkieua4125f59e5c5addba7bc96e7eb2ae6f3.png",
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
    };

    return (
        <div className="home-root">
            <Header />

            {/* 1. Hero Section */}
            <section className="home-hero" ref={addToRefs}>
                <img
                  src={heroImages[heroIndex]}
                  alt="Boss Barber Hero"
                  className="home-hero-bg"
                  style={{ transition: 'opacity 0.8s', opacity: 1 }}
                />
                <div className="home-hero-image-overlay" />
                <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 10, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {heroImages.map((img, idx) => (
                    <span key={img} style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: idx === heroIndex ? '#ffa751' : '#eee',
                      border: idx === heroIndex ? '2px solid #ffa751' : '2px solid #eee',
                      display: 'inline-block', transition: 'background 0.3s, border 0.3s',
                    }} />
                  ))}
                </div>
                <div className="home-hero-overlay" />
                <div className="home-hero-content">
                    <h1 className="home-hero-title">SAYHAIR SALON</h1>
                    <div className="home-hero-announcement animate-in">
                        ĐẲNG CẤP BARBER 
                    </div>
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
                    <div className="home-section-header">
                        <h2>DỊCH VỤ SPA</h2>
                        <h3>Thư giãn - Healing</h3>
                    </div>
                    <div className="home-spa-card" onClick={handleSpaClick}>
                        <div className="home-spa-image">
                            <img src="https://bloganchoi.com/wp-content/uploads/2024/07/lyrics-love-sand-anh-trai-say-hi-4-scaled.jpg" alt="Spa & Massage Relax" />
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
                        <div className="home-shine-main" onClick={() => window.open('https://www.coolmate.me/post/top-nhung-mau-toc-nam-dep-nhat#b-heading-H2-1', '_blank')}>
                            <img src="https://static2.vieon.vn/vieplay-image/thumbnail_v4/2024/06/06/nxc3b229_1920x1080-atsh-thumb-wean6ba97d1bf9c9797730ff248be89a9331_296_168.jpeg" alt="SHINE COLLECTION Main" />
                            <div className="home-shine-overlay">
                                <h3>Tóc ngắn nam đẹp</h3>
                                <p>Xu hướng tóc nam mới nhất</p>
                            </div>
                        </div>
                        <div className="home-shine-items">
                            <div className="home-shine-item" onClick={() => window.open('https://www.coolmate.me/post/top-nhung-mau-toc-nam-dep-nhat#b-heading-H2-17', '_blank')}>
                                <img src="https://static2.vieon.vn/vieplay-image/thumbnail_v4/2024/06/06/owkp09f7_1920x1080-atsh-thumb-tage_296_168.jpeg" alt="Tóc nam dài" />
                                <div className="home-shine-item-overlay">
                                    <h4>Tóc nam dài</h4>
                                </div>
                            </div>
                            <div className="home-shine-item" onClick={() => window.open('https://www.coolmate.me/post/top-nhung-mau-toc-nam-dep-nhat#b-heading-H2-28', '_blank')}>
                                <img src="https://static2.vieon.vn/vieplay-image/thumbnail_v4/2024/05/31/z4ahsvb5_1920x1080-atsh-thumb-ht2_296_168.jpeg" alt="Tóc nam theo khuôn mặt" />
                                <div className="home-shine-item-overlay">
                                    <h4>Tóc nam theo khuôn mặt</h4>
                                </div>
                            </div>
                            <div className="home-shine-item" onClick={() => window.open('https://www.coolmate.me/post/top-nhung-mau-toc-nam-dep-nhat#b-heading-H2-39', '_blank')}>
                                <img src="https://static2.vieon.vn/vieplay-image/thumbnail_v4/2024/06/04/rad41n86_1920x1080-atsh-thumb-quanghungmasterd_296_168.jpeg" alt="Tóc nam theo màu nhuộm" />
                                <div className="home-shine-item-overlay">
                                    <h4>Tóc nam theo màu nhuộm</h4>
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
                            <h2>SAYHAIR MEMBER</h2>
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