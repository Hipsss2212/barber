import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useCartService from '../services/cartService';
import '../assets/css/Cart.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { items, loading, error } = useSelector(state => state.cart);
    const { fetchCartItems, deleteItems } = useCartService();
    const [selectedItems, setSelectedItems] = useState({});
    const [localLoading, setLocalLoading] = useState(false);
    const navigate = useNavigate();

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

    const calculateSelectedTotal = () => {
        return items
            .filter(item => selectedItems[item.cartItemId])
            .reduce((sum, item) => sum + item.price, 0);
    };

    const countSelectedItems = () => {
        return items.filter(item => selectedItems[item.cartItemId]).length;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleCheckout = () => {
        const selectedServices = items.filter(item => selectedItems[item.cartItemId]);
        if (selectedServices.length === 0) return;

        navigate('/booking', { state: { services: selectedServices } });
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

    if (error) return <div className="error">{error}</div>;

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
                                                checked={selectedItems[item.cartItemId] || false}
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
                    <div className="header__voucher">
                        <label htmlFor="voucher">Mã Voucher:</label>
                        <input type="text" id="voucher" placeholder="Nhập mã để giảm giá" />
                    </div>
                    <div className="header__total">
                        Tổng cộng ({countSelectedItems()} dịch vụ):
                        <span id="total"> {formatCurrency(calculateSelectedTotal())}</span>
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