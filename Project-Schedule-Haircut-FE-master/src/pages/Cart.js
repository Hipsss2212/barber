import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCartService from '../services/cartService';
import useBookedService from '../services/bookedService';
import { toast } from 'react-toastify';
import '../assets/css/Cart.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../config/axios';

const Cart = () => {
    const { items, loading, error } = useSelector(state => state.cart);
    const { fetchCartItems, deleteItems } = useCartService();
    const { getBookedByStatus } = useBookedService();
    const [selectedItems, setSelectedItems] = useState({});
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();
    const [coupon, setCoupon] = useState('');
    const [couponValid, setCouponValid] = useState(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    useEffect(() => {
        const loadCartItems = async () => {
            setLocalLoading(true);
            try {
                await fetchCartItems();
            } finally {
                setLocalLoading(false);
            }
        };
        loadCartItems();
    }, []);

    useEffect(() => {
        if (items.length > 0) {
            const initialSelected = {};
            items.forEach(item => {
                initialSelected[item.cartItemId] = true;
            });
            setSelectedItems(initialSelected);
        }
    }, [items]);

    const handleCheckboxChange = (cartItemId) => {
        setSelectedItems(prev => ({
            ...prev,
            [cartItemId]: !prev[cartItemId]
        }));
    };

    const handleSelectAllChange = () => {
        const allSelected = Object.values(selectedItems).every(val => val);
        const newSelected = {};
        items.forEach(item => {
            newSelected[item.cartItemId] = !allSelected;
        });
        setSelectedItems(newSelected);
    };

    const handleDeleteSelected = async () => {
        const selectedIds = Object.keys(selectedItems)
            .filter(id => selectedItems[id])
            .map(Number);

        if (selectedIds.length === 0) return;

        try {
            setLocalLoading(true);
            await deleteItems(selectedIds);
            setSelectedItems(prev => {
                const newSelected = { ...prev };
                selectedIds.forEach(id => delete newSelected[id]);
                return newSelected;
            });
        } catch (error) {
            console.error("Xóa thất bại:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleApplyCoupon = async () => {
        setValidatingCoupon(true);
        try {
            const res = await axiosClient.get(`/api/coupons/validate?name=${coupon}`);
            if (res.valid) {
                setCouponValid(true);
                // Lấy chi tiết coupon để lấy % giảm giá
                const detail = await axiosClient.get(`/api/coupons`);
                const found = detail.find(c => c.name === coupon);
                setCouponDiscount(found ? found.discount : 0);
            } else {
                setCouponValid(false);
                setCouponDiscount(0);
            }
        } catch {
            setCouponValid(false);
            setCouponDiscount(0);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const calculateSelectedTotal = () => {
        const total = items
            .filter(item => selectedItems[item.cartItemId])
            .reduce((sum, item) => sum + item.price, 0);
        if (couponValid && couponDiscount > 0) {
            return total - (total * couponDiscount);
        }
        return total;
    };

    const countSelectedItems = () => {
        return items.filter(item => selectedItems[item.cartItemId]).length;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCheckout = async () => {
        const selectedServices = items.filter(item => selectedItems[item.cartItemId]);
        if (selectedServices.length === 0) return;

        // Kiểm tra lịch chưa hoàn thành
        try {
            const pendingBookings = await getBookedByStatus(0); // status 0: chờ xác nhận
            if (pendingBookings && pendingBookings.length > 0) {
                toast.error('Bạn đang có lịch chưa hoàn thành. Vui lòng hoàn thành hoặc hủy lịch trước khi đặt lịch mới.');
                return;
            }
        } catch (err) {
            toast.error('Không thể kiểm tra trạng thái lịch. Vui lòng thử lại.');
            return;
        }

        navigate('/booking', { state: { services: selectedServices, couponCode: couponValid ? coupon : undefined, couponDiscount: couponValid ? couponDiscount : undefined } });
    };

    if (loading || localLoading) {
        return (
            <>
                <Header />
                <main style={{ display: 'flex', justifyContent: 'center', marginTop: 260, marginBottom: 260 }}>
                    <ClipLoader color="#0a2a7c" size={50} />
                </main>
                <Footer />
            </>
        );
    }

    if (error) return <div className="error">{typeof error === 'string' ? error : error?.message || 'Có lỗi xảy ra'}</div>;

    return (
        <>
            <Header />
            <main className="container__main">
                <div className="container">
                    <div className="bulk-actions">
                        <button
                            className="btn-delete-selected"
                            onClick={handleDeleteSelected}
                            disabled={countSelectedItems() === 0}
                        >
                            {localLoading ? (
                                <ClipLoader size={15} color="#fff" />
                            ) : (
                                `Xóa ${countSelectedItems()} mục đã chọn`
                            )}
                        </button>
                    </div>

                    <table className="container__chart">
                        <thead>
                            <tr className="container__header">
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={items.length > 0 && Object.values(selectedItems).every(val => val)}
                                        onChange={handleSelectAllChange}
                                        disabled={items.length === 0}
                                    />
                                </th>
                                <th>Dịch Vụ</th>
                                <th>Đơn Giá</th>
                                <th>Thời gian</th>
                                <th>Số Tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-cart">
                                        Giỏ hàng trống
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.cartItemId}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={!!selectedItems[item.cartItemId]}
                                                onChange={() => handleCheckboxChange(item.cartItemId)}
                                            />
                                        </td>
                                        <td>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="header__service-img"
                                            />
                                            <div className="header__service1">
                                                {item.name}<br className="br1" />
                                                {item.description || 'Dịch vụ chăm sóc tóc'}
                                            </div>
                                        </td>
                                        <td>{formatCurrency(item.price)}</td>
                                        <td>{item.haircutTime} phút</td>
                                        <td>{selectedItems[item.cartItemId] ? formatCurrency(item.price) : '0₫'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Thêm giao diện nhập mã coupon */}
                    <div className="coupon-section" style={{ margin: '24px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            value={coupon}
                            onChange={e => setCoupon(e.target.value)}
                            disabled={validatingCoupon}
                            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
                        />
                        <button
                            onClick={handleApplyCoupon}
                            disabled={validatingCoupon || !coupon}
                            style={{ padding: '8px 16px', borderRadius: 4, background: '#1677ff', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            {validatingCoupon ? 'Đang kiểm tra...' : 'Áp dụng'}
                        </button>
                        {couponValid === true && (
                            <span style={{ color: 'green', marginLeft: 8 }}>Mã hợp lệ! Giảm {couponDiscount * 100}%</span>
                        )}
                        {couponValid === false && (
                            <span style={{ color: 'red', marginLeft: 8 }}>Mã không hợp lệ hoặc đã hết hạn</span>
                        )}
                    </div>
                    {/* Hiển thị số tiền giảm nếu có mã hợp lệ */}
                    {couponValid && couponDiscount > 0 && (
                        <div style={{ color: '#1677ff', fontWeight: 500, marginBottom: 8 }}>
                            Đã giảm: -{formatCurrency(
                                items.filter(item => selectedItems[item.cartItemId])
                                    .reduce((sum, item) => sum + item.price, 0) * couponDiscount
                            )}
                        </div>
                    )}
                    {/* Đã xóa phần nhập mã voucher/coupon */}
                    <div className="header__total">
                        Tổng cộng ({countSelectedItems()} dịch vụ):
                        <span id="total"> {formatCurrency(calculateSelectedTotal())}</span>
                        {couponValid && couponDiscount > 0 && (
                            <span className="coupon-discount-info">(Đã giảm {couponDiscount * 100}%)</span>
                        )}
                        <button
                            className="btn"
                            onClick={handleCheckout}
                            disabled={countSelectedItems() === 0}
                        >
                            ĐẶT LỊCH
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default Cart;