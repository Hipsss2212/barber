import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Tag, message, Spin } from 'antd';
import { SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import '../assets/css/Management.css';
import useManagementService from '../services/managementService';

const CustomerManagement = () => {
    const { getCustomers, managementState } = useManagementService();
    const [customers, setCustomers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        try {
            setLoading(true);
            const data = await getCustomers();
            setCustomers(data);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu khách hàng: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBlock = async (id) => {
        try {
            setLoading(true);

            setCustomers(customers.map(customer =>
                customer.id === id ? { ...customer, isBlocked: !customer.isBlocked } : customer
            ));
            message.success('Cập nhật trạng thái thành công');
        } catch (error) {
            message.error('Lỗi khi cập nhật trạng thái: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'SĐT',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Lịch sử đặt',
            dataIndex: 'bookings',
            key: 'bookings',
            render: bookings => `${bookings} lần`
        },
        {
            title: 'Trạng thái',
            key: 'isBlocked',
            render: (_, record) => (
                <Tag color={record.isBlocked ? 'red' : 'green'}>
                    {record.isBlocked ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={record.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => handleBlock(record.id)}
                        loading={loading}
                        disabled={loading}
                    >
                        {record.isBlocked ? 'Mở khóa' : 'Khóa'}
                    </Button>
                </Space>
            ),
        },
    ];

    const filteredData = customers.filter(customer =>
        Object.values(customer).some(value =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Khách hàng</h2>
                <Input.Search
                    placeholder="Tìm kiếm..."
                    prefix={<SearchOutlined />}
                    style={{ width: 300 }}
                    onSearch={setSearchText}
                    allowClear
                    disabled={loading}
                />
            </div>

            <Spin spinning={loading || managementState.loading}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 8 }}
                    loading={loading || managementState.loading}
                />
            </Spin>
        </div>
    );
};

export default CustomerManagement;