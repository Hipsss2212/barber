import React, { useState, useEffect } from 'react';
import { Table, Tag, DatePicker, Button, Input } from 'antd';
import { Column } from '@ant-design/charts';
import '../assets/css/Management.css';
import axiosClient from '../config/axios';

const { RangePicker } = DatePicker;

const mockTransactions = [
    { id: 'GD001', date: '2025-05-01', customer: 'Nguyễn Văn A', amount: 500000, status: 'success' },
    { id: 'GD002', date: '2025-05-02', customer: 'Trần Thị B', amount: 150000, status: 'failed' },
    { id: 'GD003', date: '2025-05-03', customer: 'Lê Quang C', amount: 200000, status: 'success' },
    { id: 'GD004', date: '2025-05-04', customer: 'Phan Minh D', amount: 350000, status: 'success' },
    { id: 'GD005', date: '2025-05-05', customer: 'Vũ Hoàng E', amount: 700000, status: 'failed' },
];

const mockRevenueData = [
    { date: '2025-05-01', amount: 500000 },
    { date: '2025-05-02', amount: 150000 },
    { date: '2025-05-03', amount: 200000 },
    { date: '2025-05-04', amount: 350000 },
    { date: '2025-05-05', amount: 700000 },
];

const TransactionManagement = () => {
    const [dateRange, setDateRange] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchTransactions();
    }, [dateRange, searchTerm]);

    const fetchTransactions = async () => {
        let params = {};
        if (dateRange && dateRange.length === 2) {
            params.from = dateRange[0];
            params.to = dateRange[1];
        }
        if (searchTerm) params.search = searchTerm;
        const res = await axiosClient.get('/admin/transactions', { params });
        setTransactions(res);
        setRevenueData(res.map(t => ({ date: t.date, amount: t.amount })));
    };

    // Hàm lọc giao dịch theo ngày
    const handleDateChange = (dates) => {
        setDateRange(dates);
        if (dates) {
            const [startDate, endDate] = dates;
            // Lọc giao dịch theo ngày (dữ liệu giả sẽ lọc trực tiếp trong mảng)
            const filteredTransactions = mockTransactions.filter(
                (transaction) => transaction.date >= startDate && transaction.date <= endDate
            );
            const filteredRevenue = mockRevenueData.filter(
                (revenue) => revenue.date >= startDate && revenue.date <= endDate
            );
            setTransactions(filteredTransactions);
            setRevenueData(filteredRevenue);
        }
    };

    // Hàm tìm kiếm giao dịch theo tên khách hàng hoặc mã giao dịch
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    // Lọc giao dịch theo tìm kiếm
    const filteredTransactions = transactions.filter((transaction) =>
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Cột của bảng giao dịch
    const columns = [
        { title: 'Mã GD', dataIndex: 'id' },
        { title: 'Thời gian', dataIndex: 'date' },
        { title: 'Khách hàng', dataIndex: 'customer' },
        { title: 'Số tiền', dataIndex: 'amount' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => (
                <Tag color={status === 'success' ? 'green' : 'red'}>
                    {status.toUpperCase()}
                </Tag>
            ),
        },
    ];

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Giao dịch</h2>
                <RangePicker
                    onChange={handleDateChange}
                    style={{ width: 300 }}
                />
                <Input
                    placeholder="Tìm kiếm theo tên khách hàng hoặc mã GD"
                    style={{ width: 300, marginLeft: 16 }}
                    onChange={handleSearchChange}
                />
            </div>

            <div style={{ marginBottom: 24 }}>
                <h3>Thống kê doanh thu</h3>
                <Column
                    data={revenueData}
                    xField="date"
                    yField="amount"
                    height={300}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredTransactions}
                rowKey="id"
                bordered
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default TransactionManagement;
