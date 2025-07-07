// StaffHome.jsx
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiCheckCircle, FiXCircle, FiUser, FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import '../assets/css/StaffHome.css';
import useStaffService from '../services/staffService';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';

const StaffHome = () => {
    const [employeeInfo, setEmployeeInfo] = useState({
        username: '',
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { logout, getStats, getHourlyAppointments, getPendingConfirmations, confirmAppointment, cancelAppointment, staffSelector } = useStaffService();

    const { loading, hourlyAppointments, bookingStats, pendingConfirmations } = staffSelector;

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    getStats(),
                    getHourlyAppointments(),
                    getPendingConfirmations(),
                ]);
            } catch (error) {
                toast.error(error.message);
            }
        };
        loadData();
    }, []);

    console.log(pendingConfirmations);
    console.log(hourlyAppointments);
    console.log(bookingStats);


    useEffect(() => {
        const username = Cookies.get('username');
        if (username) {
            setEmployeeInfo(prev => ({
                ...prev,
                username: username
            }));
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleConfirm = async (appointmentId) => {
        try {
            await confirmAppointment(appointmentId);
            toast.success('Xác nhận lịch hẹn thành công');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancel = async (appointmentId) => {
        try {
            await cancelAppointment(appointmentId);
            toast.success('Hủy lịch hẹn thành công');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const formatChartData = () => {
        // Tạo mảng giờ mặc định từ 8h đến 17h
        const defaultHours = Array.from({ length: 10 }, (_, index) => ({
            hour: 8 + index,
            appointmentCount: 0
        }));

        // Lấy dữ liệu từ API và chuyển đổi time sang dạng số giờ
        const apiData = (staffSelector.hourlyAppointments || []).map(item => ({
            hour: parseInt(item.time.split(':')[0]), // Trích xuất giờ từ "10:00:00"
            appointmentCount: item.count
        }));

        // Merge dữ liệu
        const mergedData = defaultHours.map(defaultItem => {
            const matched = apiData.find(apiItem => apiItem.hour === defaultItem.hour);
            return matched || defaultItem;
        });

        // Format lại định dạng hiển thị
        return mergedData.map(item => ({
            time: `${item.hour}h`,
            count: item.appointmentCount
        }));
    };

    const handleLogout = async () => {
        await logout();
    }

    const toggleDropdown = () => setShowDropdown(!showDropdown);

    console.log(loading, hourlyAppointments, bookingStats, pendingConfirmations);

    if (loading) {
        return (
            <div className="loading-overlay">
                <ClipLoader color="#3B82F6" size={50} />
            </div>
        );
    }

    return (
        <div className="staff-home-container">
            <div className="staff-header">
                <h1 className="page-title">Trang Chủ Nhân Viên</h1>
                <div className="employee-info">
                    <div className="username-container" onClick={toggleDropdown}>
                        <span className="username">Nhân viên, {employeeInfo.username}</span>
                        <span className={`dropdown-arrow ${showDropdown ? 'active' : ''}`}>▼</span>
                    </div>

                    {showDropdown && (
                        <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
                            <div className="dropdown-item">
                                <FiUser className="dropdown-icon" />
                                Thông tin cá nhân
                            </div>
                            <div className="dropdown-divider"></div>
                            <div className="dropdown-item logout" onClick={handleLogout}>
                                <FiLogOut className="dropdown-icon" />
                                Đăng xuất
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="stats-section">
                <h2 className="stats-title">Tháng này</h2>
                <div className="stats-container">
                    <div className="stat-card blue">
                        <h3>Tổng lịch hẹn</h3>
                        <p>{bookingStats?.totalBooked || 0}</p>
                    </div>
                    <div className="stat-card green">
                        <h3>Đã hoàn thành</h3>
                        <p>{bookingStats?.doneBooked || 0}</p>
                    </div>
                    <div className="stat-card yellow">
                        <h3>Chờ xác nhận</h3>
                        <p>{bookingStats?.upcomingBooked || 0}</p>
                    </div>
                    <div className="stat-card red">
                        <h3>Hủy/Đổi lịch</h3>
                        <p>{bookingStats?.cancelledBooked || 0}</p>
                    </div>
                </div>
            </div>

            <div className="chart-section">
                <div className="chart-header">
                    <h2><FiCalendar className="icon" /> Lịch hẹn theo giờ</h2>
                    <span className="chart-subtitle">Hôm nay</span>
                </div>
                <div className="chart-container">
                    {formatChartData().length === 0 ? (
                        <div className="no-data">Không có dữ liệu</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formatChartData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="time"
                                    interval={0}
                                    tick={{ fontSize: 12, fill: '#666' }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12, fill: '#666' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '4px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#3B82F6"
                                    barSize={25}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div className="upcoming-appointments">
                <h2>Lịch hẹn sắp tới <span className="badge">{pendingConfirmations?.length || 0}</span></h2>
                <div className="appointments-table">
                    <table className="staff-table">
                        <thead>
                            <tr>
                                <th className="staff-table-header">Trạng thái</th>
                                <th className="staff-table-header">Thời gian</th>
                                <th className="staff-table-header">Ngày đặt lịch</th>
                                <th className="staff-table-header">Khách hàng</th>
                                <th className="staff-table-header">Dịch vụ</th>
                                <th className="staff-table-header">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingConfirmations.map((appointment) => (
                                <tr key={appointment.id}>
                                    <td className="staff-table-cell">
                                        <div className={`status-badge ${appointment.status === 1 ? 'confirmed' : 'pending'}`}>
                                            {appointment.status === 1 ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                        </div>
                                    </td>

                                    <td className="staff-table-cell">{appointment.time}</td>

                                    <td className="staff-table-cell">{appointment.date}</td>

                                    <td className="staff-table-cell">{appointment.customerName}</td>

                                    <td className="staff-table-cell">
                                        {appointment.services.join(', ')}
                                    </td>

                                    <td className="staff-table-cell">
                                        <div className="action-buttons">
                                            <button
                                                className={`confirm-btn ${appointment.status === 1 ? 'confirmed' : ''}`}
                                                onClick={() => handleConfirm(appointment.id)}
                                                disabled={appointment.status === 1}
                                            >
                                                <FiCheckCircle />
                                                {appointment.status === 1 ? 'Đã xác nhận' : 'Xác nhận'}
                                            </button>
                                            <button
                                                className={`cancel-btn ${appointment.status === 1 ? 'disabled' : ''}`}
                                                onClick={() => handleCancel(appointment.id)}
                                                disabled={appointment.status === 1}
                                            >
                                                <FiXCircle />
                                                {appointment.status === 1 ? 'Không thể hủy' : 'Hủy'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StaffHome;