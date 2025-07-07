import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Switch, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const api = axios.create({ baseURL: 'http://localhost:8080/admin/coupons' });

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/');
      setCoupons(res.data);
    } catch (err) {
      message.error('Lỗi tải danh sách coupon');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = () => {
    setEditingCoupon(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCoupon(record);
    form.setFieldsValue({
      ...record,
      expiry: moment(record.expiry),
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      message.success('Xóa coupon thành công');
      fetchCoupons();
    } catch {
      message.error('Lỗi xóa coupon');
    }
  };

  const handleBlock = async (record, block) => {
    try {
      await api.patch(`/${record.id}/block?block=${block}`);
      message.success(block ? 'Đã khóa coupon' : 'Đã mở khóa coupon');
      fetchCoupons();
    } catch {
      message.error('Lỗi cập nhật trạng thái coupon');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, expiry: values.expiry.format() };
      if (editingCoupon) {
        await api.put(`/${editingCoupon.id}`, data);
        message.success('Cập nhật coupon thành công');
      } else {
        await api.post('/', data);
        message.success('Tạo coupon thành công');
      }
      setModalVisible(false);
      fetchCoupons();
    } catch (err) {
      // validation error
    }
  };

  // Tìm kiếm theo tên
  const filteredCoupons = coupons.filter(coupon =>
    coupon.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: 'Tên', dataIndex: 'name', key: 'name', width: 180 },
    { title: 'Giảm giá (%)', dataIndex: 'discount', key: 'discount', width: 120, render: (v) => v * 100 },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', width: 160, render: (v) => moment(v).format('YYYY-MM-DD HH:mm') },
    { title: 'Hết hạn', dataIndex: 'expiry', key: 'expiry', width: 160, render: (v) => moment(v).format('YYYY-MM-DD HH:mm') },
    { title: 'Trạng thái', dataIndex: 'isBlocked', key: 'isBlocked', width: 120, render: (v) => v ? <Tag color="red">Đã khóa</Tag> : <Tag color="green">Đang mở</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} type="primary" size="small">Sửa</Button>
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
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý Coupon</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm theo tên coupon"
          prefix={<SearchOutlined />}
          allowClear
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 240 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Thêm Coupon</Button>
      </Space>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredCoupons}
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
        size="middle"
      />
      <Modal
        title={editingCoupon ? 'Sửa Coupon' : 'Thêm Coupon'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
        okText={editingCoupon ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên coupon" rules={[{ required: true, message: 'Nhập tên coupon' }]}> <Input /> </Form.Item>
          <Form.Item name="discount" label="Giảm giá (0-1)" rules={[{ required: true, type: 'number', min: 0, max: 1, message: 'Nhập số từ 0 đến 1' }]}> <InputNumber step={0.01} style={{ width: '100%' }} /> </Form.Item>
          <Form.Item name="expiry" label="Ngày hết hạn" rules={[{ required: true, message: 'Chọn ngày hết hạn' }]}> <DatePicker showTime style={{ width: '100%' }} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement; 