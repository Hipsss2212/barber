import Dashboard from '../components/Dashboard';
import ServiceManagement from '../components/ServiceManagement';
import CustomerManagement from '../components/CustomerManagement';
import StaffManagement from '../components/StaffManagement';
import ScheduleManagement from '../components/ScheduleManagement';
import TransactionManagement from '../components/TransactionManagement';
import StaffLoginForm from '../components/StaffLogin';
import AdminHome from '../pages/AdminHome';
import Booking from '../pages/Booking';
import BookingHistory from '../pages/BookingHistory';
import Cart from '../pages/Cart';
import HaircutDetail from '../pages/HaircutDetail';
import Home from '../pages/Home';
import MainLayout from '../pages/MainLayout';
import PaymentPage from '../pages/PaymentPage';
import PaymentReturn from '../pages/PaymentReturn';
import Profile from '../pages/Profile';
import StaffHome from '../pages/StaffHome';
import AdminLoginForm from '../components/AdminLogin';
import PrivateRoute from '../routers/privateRouters/PrivateRoute';
import AccountManagement from '../components/AccountManagement';
import VerifyEmail from '../components/VerifyEmail';
import { Navigate } from 'react-router-dom';
import AboutUs from '../pages/AboutUs';
import CouponManagement from '../components/CouponManagement';

const routes = [
    {
        path: '/',
        element: <Navigate to="/home" replace />,
        private: false,
    },
    {
        path: '/home',
        element: (
            <PrivateRoute
                allowUnauthenticatedPaths={['/home', '/detail/:categoryId']}
                blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}
            >
                <MainLayout>
                    <Home />
                </MainLayout>
            </PrivateRoute>
        ),
        private: false,
    },
    {
        path: '/detail/:categoryId',
        element: (
            <PrivateRoute
                allowUnauthenticatedPaths={['/home', '/detail/:categoryId']}
                blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}
            >
                <MainLayout>
                    <HaircutDetail />
                </MainLayout>
            </PrivateRoute>
        ),
        private: false,
    },
    {
        path: '/cart',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <MainLayout>
                    <Cart />
                </MainLayout>
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/profile',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <MainLayout>
                    <Profile />
                </MainLayout>
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/booking',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <MainLayout>
                    <Booking />
                </MainLayout>
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/booking-history',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <MainLayout>
                    <BookingHistory />
                </MainLayout>
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/payment/:bookingId',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <PaymentPage />
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/payment-return',
        element: (
            <PrivateRoute requiredRole="ROLE_USER" blockedRoles={['ROLE_EMPLOYEE', 'ROLE_ADMIN']}>
                <PaymentReturn />
            </PrivateRoute>
        ),
        private: true,
    },
    {
        path: '/employee/home',
        element: (
            <PrivateRoute
                requiredRole="ROLE_EMPLOYEE"
                loginPage={<StaffLoginForm />}
                blockedRoles={['ROLE_ADMIN', 'ROLE_USER']}
            >
                <StaffHome />
            </PrivateRoute>
        ),
        private: false,
    },
    {
        path: '/admin/*',
        element: (
            <PrivateRoute
                requiredRole="ROLE_ADMIN"
                loginPage={<AdminLoginForm />}
                blockedRoles={['ROLE_EMPLOYEE', 'ROLE_USER']}>
                <AdminHome />
            </PrivateRoute>
        ),
        private: false,
        children: [
            { path: '', element: <Dashboard /> },
            { path: 'acounts', element: <AccountManagement /> },
            { path: 'schedules', element: <ScheduleManagement /> },
            { path: 'services', element: <ServiceManagement /> },
            { path: 'transactions', element: <TransactionManagement /> },
            { path: 'coupons', element: <CouponManagement /> },
        ],
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />, 
        private: false,
    },
    {
        path: '/about',
        element: (
            <MainLayout>
                <AboutUs />
            </MainLayout>
        ),
        private: false,
    },
];

export default routes;
