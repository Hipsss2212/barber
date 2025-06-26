import React from "react";
import "../assets/css/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <p><a href="#">Về chúng tôi</a></p>
                    <p><a href="#">Học cắt tóc</a></p>
                    <p><a href="#">Tìm 30Shine gần nhất</a></p>
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
                    <p>Tải ứng dụng 30Shine</p>
                    <div className="app-links">
                        <img src={require("../assets/image/appstore.png")} alt="App Store" />
                        <img src={require("../assets/image/googleplay.png")} alt="Google Play" />
                    </div>
                </div>
                <div className="footer-column">
                    <p>Tham gia cộng đồng thành viên</p>
                    <div className="social-links">
                        <img src={require("../assets/image/facebook.png")} alt="Facebook" />
                        <img src={require("../assets/image/youtube.png")} alt="YouTube" />
                        <img src={require("../assets/image/tiktok.png")} alt="TikTok" />
                        <img src={require("../assets/image/dmca.png")} alt="DMCA" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
