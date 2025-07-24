import React, { useEffect, useState } from 'react';
import '../assets/css/Profile.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';
import useEmployeeProfileService from '../services/employeeProfileService';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const EmployeeProfile = () => {
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phone: '',
        address: '',
        avatar: '',
        age: 22 // mặc định nếu chưa có
    });
    const {
        getProfile,
        updateProfileService,
        profileSelector
    } = useEmployeeProfileService();
    const { loading, profile } = profileSelector;
    const [avatarLink, setAvatarLink] = useState('');
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const username = Cookies.get('username');
            try {
                const data = await getProfile(username);
                setFormData({
                    userName: data.userName || '',
                    fullName: data.fullName || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    avatar: data.avatar || '',
                    age: data.age || 22 // mặc định nếu chưa có
                });
                setAvatarLink(data.avatar || '');
            } catch (error) {
                console.log(error.message || 'Lỗi khi lấy thông tin nhân viên');
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Email không hợp lệ');
            return false;
        }
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Số điện thoại không hợp lệ');
            return false;
        }
        if (formData.address.trim() === '') {
            toast.error('Vui lòng nhập địa chỉ');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            // Gửi đủ trường cho backend
            await updateProfileService({
                ...formData,
                avatar: avatarLink || formData.avatar,
                age: Number(formData.age) || 22
            });
            const username = Cookies.get('username');
            await getProfile(username);
        } catch (error) {
            toast.error(error.message || 'Cập nhật thất bại');
        }
    };

    const handleAvatarLinkChange = (e) => setAvatarLink(e.target.value);
    const handleUpdateAvatar = async () => {
        try {
            await updateProfileService({ ...formData, avatar: avatarLink });
            toast.success('Cập nhật ảnh đại diện thành công!');
            const username = Cookies.get('username');
            await getProfile(username);
            setShowInput(false);
        } catch (err) {
            toast.error('Cập nhật ảnh đại diện thất bại!');
        }
    };
    const handleInputBlur = () => {
        if (avatarLink && showInput) {
            handleUpdateAvatar();
        } else {
            setShowInput(false);
        }
    };
    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleUpdateAvatar();
        }
    };
    if (loading) {
        return (
            <>
                <Header />
                <main style={{ display: 'flex', justifyContent: 'center', marginTop: 260, marginBottom: 260 }}>
                    <ClipLoader color="#3498db" size={50} />
                </main>
                <Footer />
            </>
        );
    }
    return (
        <>
            <Header />
            <main>
                <div className="profile-modern-container">
                    <h2 className="profile-modern-title">Thông Tin Nhân Viên</h2>
                    <div className="profile-modern-content">
                        <div className="profile-modern-avatar-block">
                            <div className="profile-modern-avatar-wrapper">
                                <img
                                    src={avatarLink || formData.avatar}
                                    alt="Ảnh nhân viên"
                                    className="profile-modern-avatar-img"
                                />
                                {showInput ? (
                                    <input
                                        type="text"
                                        placeholder="Dán link ảnh vào đây"
                                        value={avatarLink}
                                        onChange={handleAvatarLinkChange}
                                        onBlur={handleInputBlur}
                                        onKeyDown={handleInputKeyDown}
                                        autoFocus
                                        className="profile-modern-avatar-link-input"
                                    />
                                ) : (
                                    <button
                                        type="button"
                                        className="profile-modern-avatar-btn"
                                        onClick={() => setShowInput(true)}
                                    >
                                        Cập nhật ảnh
                                    </button>
                                )}
                            </div>
                            <div className="profile-modern-username">{formData.userName}</div>
                        </div>
                        <form className="profile-modern-form" onSubmit={handleSubmit}>
                            <div className="profile-modern-form-group">
                                <label>Tên đăng nhập</label>
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>
                            <div className="profile-modern-form-group">
                                <label>Họ tên</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ tên"
                                />
                            </div>
                            <div className="profile-modern-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email của bạn"
                                />
                            </div>
                            <div className="profile-modern-form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại của bạn"
                                />
                            </div>
                            <div className="profile-modern-form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Nhập địa chỉ của bạn"
                                />
                            </div>
                            <div className="profile-modern-form-group">
                                <label>Tuổi</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tuổi"
                                    min={18}
                                    max={80}
                                />
                            </div>
                            <button
                                type="submit"
                                className="profile-modern-save-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <ClipLoader size={20} color="#fff" />
                                ) : (
                                    'Lưu thay đổi'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default EmployeeProfile; 