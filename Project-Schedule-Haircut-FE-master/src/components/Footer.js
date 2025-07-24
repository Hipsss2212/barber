import React from "react";
import "../assets/css/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <p><a href="#">Về chúng tôi</a></p>
                    <p><a href="#">Học cắt tóc</a></p>
                    <p><a href="https://www.bing.com/search?q=fpt%20university%20da%20nang%20%C4%91%E1%BB%8Ba%20ch%E1%BB%89%20map" target="_blank" rel="noopener noreferrer">Tìm SayHi Salon gần nhất</a></p>
                </div>
                <div className="footer-column">
                    <p>Hotline (1000đ/phút): <strong>1900112233</strong></p>
                    <p>Liên hệ học nghề tóc: <strong>0905123456</strong></p>
                    <p><a href="#">Liên hệ quảng cáo</a></p>
                </div>
                <div className="footer-column">
                    <p>Giờ phục vụ: <br /> Thứ 2 đến Chủ nhật, <br /> 8h30 - 20h30</p>
                    <p>Giấy phép giáo dục nghề nghiệp</p>
                </div>
                <div className="footer-column">
                    <p>Tải ứng dụng SayHi Salon</p>
                    <div className="app-links">
                        <img src={require("../assets/image/appstore.png")} alt="App Store" />
                        <img src={require("../assets/image/googleplay.png")} alt="Google Play" />
                    </div>
                </div>
                <div className="footer-column">
                    <p>Tham gia cộng đồng thành viên</p>
                    <div className="social-links">
                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
                            <img src={require("../assets/image/facebook.png")} alt="Facebook" />
                        </a>
                        <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer">
                            <img src={require("../assets/image/youtube.png")} alt="YouTube" />
                        </a>
                        <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer">
                            <img src={require("../assets/image/tiktok.png")} alt="TikTok" />
                        </a>
                        <img src={require("../assets/image/dmca.png")} alt="DMCA" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
