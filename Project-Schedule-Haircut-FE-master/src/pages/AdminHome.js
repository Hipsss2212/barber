import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Dropdown, Avatar, message } from 'antd';
import {
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    ProfileOutlined,
    TeamOutlined,
    ScheduleOutlined,
    ShoppingOutlined,
    TransactionOutlined,
    PieChartOutlined
} from '@ant-design/icons';
import { FaSun, FaMoon } from 'react-icons/fa';
import Dashboard from '../components/Dashboard';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import ScheduleManagement from '../components/ScheduleManagement';
import ServiceManagement from '../components/ServiceManagement';
import TransactionManagement from '../components/TransactionManagement';
import useAuthService from '../services/authService';
import Cookies from 'js-cookie';
import AccountManagement from '../components/AccountManagement';

const { Header, Content, Sider } = Layout;

const AdminHome = () => {
    const [theme, setTheme] = useState('dark');
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const { logout } = useAuthService();

    const menuItems = [
        {
            key: '1',
            icon: <PieChartOutlined />,
            label: <Link to="/admin">Báo cáo thống kê</Link>,
        },
        {
            key: '2',
            icon: <UserOutlined />,
            label: <Link to="/admin/accounts">Tài khoản</Link>,
        },
        {
            key: '3',
            icon: <ScheduleOutlined />,
            label: <Link to="/admin/schedules">Lịch trình</Link>,
        },
        {
            key: '4',
            icon: <ShoppingOutlined />,
            label: <Link to="/admin/services">Dịch vụ</Link>,
        },
        {
            key: '5',
            icon: <TransactionOutlined />,
            label: <Link to="/admin/transactions">Giao dịch</Link>,
        },
        {
            key: '6',
            icon: <ShoppingOutlined />,
            label: <Link to="/admin/coupons">Quản lý Coupon</Link>,
        },
    ];

    useEffect(() => {
        document.documentElement.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
        const user = Cookies.get('username');
        setCurrentUser(user);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
    };

    const handleLogout = async () => {
        await logout();
        navigate('/home');
    };

    const userMenuItems = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: <Link to="/admin/profile">Thông tin cá nhân</Link>,
        },
        // {
        //     key: 'settings',
        //     icon: <SettingOutlined />,
        //     label: <Link to="/admin/settings">Cài đặt</Link>,
        // },
        { type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            onClick: handleLogout,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible theme={theme}>
                <div className="admin-logo">
                    <h2 style={{ color: theme === 'dark' ? '#fff' : '#000', textAlign: 'center' }}>
                        Trang quản trị SayHair
                    </h2>
                </div>
                <Menu theme={theme} defaultSelectedKeys={['1']} mode="inline" items={menuItems} />
            </Sider>

            <Layout className="site-layout">
                <Header className="admin-header">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                        <button className="theme-toggle-button" onClick={toggleTheme}>
                            {theme === 'dark' ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
                        </button>

                        {currentUser && (
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                    <Avatar
                                        size="default"
                                        icon={<UserOutlined />}
                                    />
                                    <span style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
                                        {currentUser}
                                    </span>
                                </div>
                            </Dropdown>
                        )}
                    </div>
                </Header>
                <Content className="admin-content">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="accounts" element={<AccountManagement />} />
                        <Route path="schedules" element={<ScheduleManagement />} />
                        <Route path="services" element={<ServiceManagement />} />
                        <Route path="transactions" element={<TransactionManagement />} />
                    </Routes>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminHome;