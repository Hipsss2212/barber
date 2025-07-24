import React, { useState, useEffect } from 'react';
import {
    Table, Button, Space, Input, message, Popconfirm, Modal, Form, InputNumber, DatePicker, Tag, Spin
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import axiosClient from '../config/axios';
import moment from 'moment';

const CouponManagement = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/admin/coupons');
            setCoupons(res);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu: ' + (error?.message || ''));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (value) => setSearchText(value);

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await axiosClient.delete(`/admin/coupons/${id}`);
            message.success('Xóa coupon thành công');
            fetchData();
        } catch (error) {
            message.error('Lỗi xóa coupon');
        }
        setLoading(false);
    };

    const openAddModal = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingItem(record);
        form.setFieldsValue({
            ...record,
            expiry: moment(record.expiry),
        });
        setIsModalOpen(true);
    };

    const handleBlock = async (record, block) => {
        setLoading(true);
        try {
            await axiosClient.patch(`/admin/coupons/${record.id}/block?block=${block}`);
            message.success(block ? 'Đã khóa coupon' : 'Đã mở khóa coupon');
            fetchData();
        } catch {
            message.error('Lỗi cập nhật trạng thái coupon');
        }
        setLoading(false);
    };

    const handleModalOk = async () => {
        setLoading(true);
        try {
            const values = await form.validateFields();
            const data = { ...values, expiry: values.expiry.format() };
            if (editingItem) {
                await axiosClient.put(`/admin/coupons/${editingItem.id}`, data);
                message.success('Cập nhật coupon thành công');
            } else {
                await axiosClient.post('/admin/coupons', data);
                message.success('Tạo coupon thành công');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            // validation error
        }
        setLoading(false);
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
        { title: 'Tên', dataIndex: 'name', key: 'name', width: 180 },
        { title: 'Giảm giá (%)', dataIndex: 'discount', key: 'discount', width: 120, render: (v) => v * 100 },
        { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 160, render: (v) => moment(v).format('YYYY-MM-DD HH:mm') },
        { title: 'Hết hạn', dataIndex: 'expiry', key: 'expiry', width: 160, render: (v) => moment(v).format('YYYY-MM-DD HH:mm') },
        { title: 'Trạng thái', dataIndex: 'isBlocked', key: 'isBlocked', width: 120, render: (v) => v ? <Tag color="red">Đã khóa</Tag> : <Tag color="green">Đang mở</Tag> },
        {
            title: 'Thao tác',
            key: 'action',
            width: 220,
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} type="primary" size="small">Sửa</Button>
                    <Popconfirm title="Xóa coupon này?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
                        <Button icon={<DeleteOutlined />} danger size="small">Xóa</Button>
                    </Popconfirm>
                    <Button
                        icon={record.isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => handleBlock(record, !record.isBlocked)}
                        size="small"
                        type={record.isBlocked ? 'default' : 'dashed'}
                    >
                        {record.isBlocked ? 'Mở khóa' : 'Khóa'}
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Coupon</h2>
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm coupon..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        allowClear
                        disabled={loading}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                        disabled={loading}
                    >
                        Thêm mới
                    </Button>
                </Space>
            </div>
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={filteredCoupons}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} coupon`
                    }}
                    scroll={{ x: true }}
                />
            </Spin>
            <Modal
                title={editingItem ? 'Chỉnh sửa coupon' : 'Thêm coupon mới'}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                confirmLoading={loading}
                width={500}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên coupon"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên coupon!' }]}
                    >
                        <Input placeholder="Nhập tên coupon" />
                    </Form.Item>
                    <Form.Item
                        label="Giảm giá (0-1)"
                        name="discount"
                        rules={[{ required: true, type: 'number', min: 0, max: 1, message: 'Nhập số từ 0 đến 1' }]}
                    >
                        <InputNumber step={0.01} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Ngày hết hạn"
                        name="expiry"
                        rules={[{ required: true, message: 'Chọn ngày hết hạn!' }]}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CouponManagement; 