import React, { useEffect, useState } from 'react';
import '../assets/css/Profile.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cookies from 'js-cookie';
import useProfileService from '../services/profileService';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Profile = () => {
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: ''
    });

    const {
        getProfile,
        updateProfileService,
        profileSelector
    } = useProfileService();

    const { loading, profile, error } = profileSelector;

    useEffect(() => {
        const fetchData = async () => {
            const username = Cookies.get('username');
            try {
                const data = await getProfile(username);

                setFormData({
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || ''
                });
            } catch (error) {
                console.log(error.message || 'Lỗi khi lấy thông tin người dùng');

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
            await updateProfileService(formData);

            const username = Cookies.get('username');
            await getProfile(username);
        } catch (error) {
            toast.error(error.message || 'Cập nhật thất bại');
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
                <div className="profile">
                    <h2>Hồ Sơ Của Tôi</h2>
                    <div className="content">
                        <form className="profile__form-panel" onSubmit={handleSubmit}>
                            <div className="profile__form-group">
                                <label>Tên đăng nhập</label>
                                <span>{profile?.userName}</span>
                            </div>

                            <div className="profile__form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Hãy nhập email của bạn"
                                />
                            </div>

                            <div className="profile__form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Hãy nhập số điện thoại của bạn"
                                />
                            </div>

                            <div className="profile__form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Hãy nhập địa chỉ của bạn"
                                />
                            </div>

                            <button
                                type="submit"
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <ClipLoader size={20} color="#fff" />
                                ) : (
                                    'Lưu'
                                )}
                            </button>
                        </form>

                        <div className="profile__form-avatar">
                            <div className="avatar">
                                <img
                                    src={profile?.avatar}
                                    alt="Ảnh người dùng"
                                />
                            </div>
                            <button className="profile__form-avatar-upload-btn">Chọn ảnh</button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Profile;