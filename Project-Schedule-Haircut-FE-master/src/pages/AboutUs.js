import React from 'react';
import './AboutUs.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bannerImage from '../assets/image/barber1.jpg';
import value1 from '../assets/image/stylist1.png';
import value2 from '../assets/image/stylist2.png';
import value3 from '../assets/image/barber2.jpg';
import value4 from '../assets/image/barber3.jpg';

const coreValues = [
  {
    icon: '✂️',
    title: 'Tay nghề chuyên nghiệp',
    desc: 'Đội ngũ barber nhiều năm kinh nghiệm, luôn cập nhật xu hướng.'
  },
  {
    icon: '🧠',
    title: 'Phong cách cá nhân hóa',
    desc: 'Tư vấn kiểu tóc phù hợp với khuôn mặt, phong cách sống và môi trường làm việc.'
  },
  {
    icon: '☕',
    title: 'Không gian thân thiện',
    desc: 'Thiết kế hiện đại, sạch sẽ và thoải mái như một nơi "chill" riêng của phái mạnh.'
  },
  {
    icon: '❤️',
    title: 'Dịch vụ tận tâm',
    desc: 'Không chỉ cắt tóc, mà còn gội đầu, massage da đầu, tạo kiểu – từng chi tiết đều được chăm chút.'
  },
];

const AboutUs = () => {
  return (
    <div className="aboutus-root">
      <Header />
      {/* Phần 1: Banner/Header lớn */}
      <section className="aboutus-hero">
        <img src={bannerImage} alt="Barber đang cắt tóc" className="aboutus-hero-bg" />
        <div className="aboutus-hero-overlay" />
        <div className="aboutus-hero-content">
          <h1>Về Boss Barber</h1>
          <p className="aboutus-hero-slogan">Nơi phong cách bắt đầu</p>
        </div>
      </section>
      {/* Phần 2: Giới thiệu ngắn */}
      <section className="aboutus-intro animate-in">
        <div className="aboutus-intro-icon">✂️💈</div>
        <div className="aboutus-intro-content">
          <p>
            Tại Boss Barber, chúng tôi tin rằng một mái tóc đẹp không chỉ là vẻ bề ngoài – đó là tuyên ngôn cá tính của người đàn ông hiện đại. Được thành lập từ niềm đam mê dành cho nghệ thuật barber, Boss Barber ra đời với sứ mệnh nâng tầm trải nghiệm chăm sóc tóc cho nam giới – nơi mỗi lần cắt là một lần tái tạo phong cách và sự tự tin.
          </p>
        </div>
      </section>
      {/* Phần 3: 4 Giá trị cốt lõi */}
      <section className="aboutus-values animate-in">
        <div className="aboutus-values-grid">
          {coreValues.map((v, idx) => (
            <div className="aboutus-value-card" key={idx}>
              <div className="aboutus-value-icon">{v.icon}</div>
              <div className="aboutus-value-title">{v.title}</div>
              <div className="aboutus-value-desc">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Phần 4: Lý do khách quay lại */}
      <section className="aboutus-reason animate-in">
        <div className="aboutus-reason-grid">
          <div className="aboutus-reason-img-wrap">
            <img src="https://cdn.tuoitre.vn/471584752817336320/2024/4/9/vch-mc-tran-thanh-17126726282441492066394.png" alt="Không gian Barber" className="aboutus-reason-img" />
          </div>
          <div className="aboutus-reason-content">
            <h2>Tại sao khách hàng luôn quay lại?</h2>
            <ul>
              <li>Barber nắm bắt được cá tính của từng người.</li>
              <li>Không gian riêng tư, không ồn ào.</li>
              <li>Dịch vụ gội đầu thư giãn, massage nhẹ nhàng sau một ngày mệt mỏi.</li>
            </ul>
            <p className="aboutus-reason-desc">
              Không đơn thuần là một tiệm cắt tóc, Boss Barber là nơi nam giới cảm thấy được lắng nghe và tôn trọng. Từ những cuộc trò chuyện nhẹ nhàng, tư vấn chân thành cho đến những đường kéo dứt khoát và chính xác – chúng tôi mang lại trải nghiệm khó quên mỗi lần ghé tiệm.
            </p>
          </div>
        </div>
      </section>
      {/* Phần 5: Cam kết chất lượng */}
      <section className="aboutus-commit animate-in">
        <div className="aboutus-commit-box">
          <blockquote>
            "Chúng tôi cam kết mang lại chất lượng dịch vụ tốt nhất, với sự chuyên nghiệp và tận tâm trong từng đường kéo. Mỗi khách hàng rời khỏi Boss Barber đều mang theo một diện mạo chỉn chu và một tinh thần tự tin, sẵn sàng đối mặt mọi thử thách của cuộc sống."
          </blockquote>
        </div>
      </section>
      {/* Phần 6: CTA */}
      <section className="aboutus-cta animate-in">
        <button className="aboutus-cta-btn" onClick={() => window.location.href='/booking'}>
          Đặt lịch ngay
        </button>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs; 