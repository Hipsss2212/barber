// StaffHome.jsx
import { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiCalendar, FiCheckCircle, FiXCircle, FiUser, FiLogOut } from 'react-icons/fi';
import { FaCalendarAlt, FaCheckCircle, FaUserCheck, FaTimesCircle, FaClipboardList } from 'react-icons/fa';
import Cookies from 'js-cookie';
import '../assets/css/StaffHome.css';
import useStaffService from '../services/staffService';
import { toast } from 'react-toastify';
import ClipLoader from 'react-spinners/ClipLoader';
import { parse, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const StaffHome = () => {
    const [employeeInfo, setEmployeeInfo] = useState({
        username: '',
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const { logout, getStats, getHourlyAppointments, getPendingConfirmations, confirmAppointment, cancelAppointment, staffSelector } = useStaffService();
    const navigate = useNavigate();

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

    // Thêm hàm kiểm tra có thể hủy (sửa lại cho chắc chắn)
    const isCancelable = (appointment) => {
      const now = new Date();
      // Xử lý ngày: hỗ trợ dd/MM/yyyy, dd-MM-yyyy, yyyy-MM-dd
      let dateStr = appointment.date;
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        // dd/MM/yyyy -> yyyy-MM-dd
        const [day, month, year] = dateStr.split('/');
        dateStr = `${year}-${month}-${day}`;
      } else if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
        // dd-MM-yyyy -> yyyy-MM-dd
        const [day, month, year] = dateStr.split('-');
        dateStr = `${year}-${month}-${day}`;
      }
      const startTime = appointment.time.split(' - ')[0];
      // Đảm bảo có đủ 0 ở giờ/phút
      const [h, m] = startTime.split(':');
      const hh = h.padStart(2, '0');
      const mm = m.padStart(2, '0');
      const bookingDateTime = new Date(`${dateStr}T${hh}:${mm}:00`);
      const timeDiff = bookingDateTime - now;
      return appointment.status === 1 && timeDiff > 3600000;
    };

    // Thêm hàm hoàn thành lịch hẹn
    const handleComplete = async (appointmentId) => {
        try {
            await confirmAppointment(appointmentId, true); // true: đánh dấu hoàn thành
            toast.success('Đã hoàn thành lịch hẹn');
        } catch (error) {
            toast.error(error.message);
        }
    };

    console.log(loading, hourlyAppointments, bookingStats, pendingConfirmations);

    if (loading) {
        return (
            <div className="loading-overlay">
                <ClipLoader color="#3B82F6" size={50} />
            </div>
        );
    }

    return (
        <div className="staff-home-dynamic">
            <header className="staff-header-dynamic">
                <div className="header-left">
                    <FaClipboardList className="header-main-icon" />
                    <h1 className="page-title-dynamic">Trang Chủ Nhân Viên</h1>
                </div>
                <div className="employee-info-dynamic">
                    <div className="username-container" onClick={toggleDropdown}>
                        <span className="username">Nhân viên, {employeeInfo.username}</span>
                        <span className={`dropdown-arrow ${showDropdown ? 'active' : ''}`}>▼</span>
                    </div>
                    {showDropdown && (
                        <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
                            <div className="dropdown-item" onClick={() => { navigate('/employee/profile'); setShowDropdown(false); }}>
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
            </header>
            <section className="stats-section-dynamic">
                <div className="stats-container-dynamic">
                    <div className="stat-card-dynamic blue">
                        <div className="stat-icon"><FaClipboardList /></div>
                        <div className="stat-info">
                            <span className="stat-title">Tổng lịch hẹn</span>
                            <span className="stat-value">{bookingStats?.totalBooked || 0}</span>
                        </div>
                    </div>
                    <div className="stat-card-dynamic green">
                        <div className="stat-icon"><FaCheckCircle /></div>
                        <div className="stat-info">
                            <span className="stat-title">Đã hoàn thành</span>
                            <span className="stat-value">{bookingStats?.doneBooked || 0}</span>
                        </div>
                    </div>
                    <div className="stat-card-dynamic yellow">
                        <div className="stat-icon"><FaUserCheck /></div>
                        <div className="stat-info">
                            <span className="stat-title">Chờ xác nhận</span>
                            <span className="stat-value">{bookingStats?.upcomingBooked || 0}</span>
                        </div>
                    </div>
                    <div className="stat-card-dynamic red">
                        <div className="stat-icon"><FaTimesCircle /></div>
                        <div className="stat-info">
                            <span className="stat-title">Hủy/Đổi lịch</span>
                            <span className="stat-value">{bookingStats?.cancelledBooked || 0}</span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="chart-section-dynamic">
                <div className="chart-header-dynamic">
                    <h2><FaCalendarAlt className="icon" /> Lịch hẹn theo giờ</h2>
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
            </section>
            <section className="upcoming-appointments-dynamic">
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
                                    <td className="staff-table-cell">{appointment.services.join(', ')}</td>
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
                                                className={`cancel-btn ${!isCancelable(appointment) ? 'disabled' : ''}`}
                                                onClick={() => handleCancel(appointment.id)}
                                                disabled={!isCancelable(appointment)}
                                            >
                                                <FiXCircle />
                                                {!isCancelable(appointment) ? 'Không thể hủy' : 'Hủy'}
                                            </button>
                                            {appointment.status === 1 && (
                                                <button
                                                    className="complete-btn"
                                                    onClick={() => handleComplete(appointment.id)}
                                                >
                                                    ✅ Hoàn thành
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default StaffHome;