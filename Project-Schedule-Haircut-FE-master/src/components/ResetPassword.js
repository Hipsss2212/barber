import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/ForgotPassword.css';
import { toast } from 'react-toastify';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
    const query = useQuery();
    const navigate = useNavigate();
    const token = query.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }
        if (newPassword.length < 8) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu không khớp');
            return;
        }
        setLoading(true);
        try {
            await axios.post('/web/password/reset', { token, newPassword });
            setSuccess(true);
            toast.success('Đổi mật khẩu thành công!');
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            toast.error(err?.response?.data || 'Đổi mật khẩu thất bại.');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return <div style={{padding:'2rem',color:'red'}}>Link không hợp lệ hoặc đã hết hạn.</div>;
    }

    return (
        <div className="forgot-container">
            <h2 className="forgot-title">ĐẶT LẠI MẬT KHẨU</h2>
            {success ? (
                <div className="forgot-description" style={{textAlign:'center',color:'#28a745',marginTop:'2rem'}}>
                    Đổi mật khẩu thành công!<br/>Bạn sẽ được chuyển về trang đăng nhập.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                            minLength={8}
                            disabled={loading}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            disabled={loading}
                        />
                    </div>
                    <button
                        className={`send-button${loading ? ' loading' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword; 