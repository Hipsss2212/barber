import React, { useEffect, useState, useRef } from 'react';
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Switch,
  Tag,
  Spin
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import useCouponService from '../services/couponService';

const CouponManagement = () => {
  const {
    getCoupons,
    createNewCoupon,
    updateExistingCoupon,
    deleteCouponAction,
    blockCouponAction,
    unblockCouponAction,
    couponState
  } = useCouponService();

  // Dùng useRef để giữ instance form duy nhất, không gọi conditionally
  const formRef = useRef(Form.useForm());
  const [form] = formRef.current;

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    getCoupons();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      discount: Number(record.discount) * 100 || 1, // Hiển thị % (nhân 100)
      created_at: record.created_at ? dayjs(record.created_at) : undefined,
      expiry: record.expiry ? dayjs(record.expiry) : undefined,
      is_blocked: !!record.is_blocked
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteCouponAction(id);
    getCoupons();
  };

  const handleBlock = async (id) => {
    await blockCouponAction(id);
    getCoupons();
  };

  const handleUnblock = async (id) => {
    await unblockCouponAction(id);
    getCoupons();
  };

  const handleOk = async () => {
    try {
      // Debug: kiểm tra giá trị discount trước khi validate
      const currentDiscount = form.getFieldValue('discount');
      console.log('Current discount value:', currentDiscount, typeof currentDiscount);
      
      const values = await form.validateFields();
      console.log('Form values:', values); // Debug
      
      // Đảm bảo discount là number
      const discountValue = Number(values.discount);
      if (isNaN(discountValue) || discountValue < 1 || discountValue > 100) {
        throw new Error('Discount phải là số từ 1-100');
      }
      
      const payload = {
        ...values,
        discount: discountValue / 100, // Chuyển về dạng số thực (0.1 = 10%)
        created_at: values.created_at ? values.created_at.toISOString() : new Date().toISOString(),
        expiry: values.expiry ? values.expiry.toISOString() : undefined,
        is_blocked: !!values.is_blocked
      };
      console.log('Payload:', payload); // Debug
      if (editing) {
        await updateExistingCoupon(editing.id, payload);
      } else {
        await createNewCoupon(payload);
      }
      setModalOpen(false);
      getCoupons();
    } catch (err) {
      console.error('Form validation error:', err); // Debug
      console.error('Error details:', err.errorFields); // Debug chi tiết
      // error đã được hiển thị qua message
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Giảm (%)',
      dataIndex: 'discount',
      key: 'discount',
      render: v => (v * 100).toFixed(0) + '%'
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: v => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      title: 'Hết hạn',
      dataIndex: 'expiry',
      key: 'expiry',
      render: v => v ? dayjs(v).format('DD/MM/YYYY HH:mm') : ''
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_blocked',
      key: 'is_blocked',
      render: v => v ? <Tag color="red">Blocked</Tag> : <Tag color="green">Active</Tag>
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
          {record.is_blocked ? (
            <Button icon={<UnlockOutlined />} onClick={() => handleUnblock(record.id)} />
          ) : (
            <Button icon={<LockOutlined />} onClick={() => handleBlock(record.id)} />
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="management-container">
      <div className="management-header">
        <h2>Quản lý Coupon</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm Coupon
        </Button>
      </div>
      <Spin spinning={couponState.loading}>
        <Table
          dataSource={couponState.coupons}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 8 }}
        />
      </Spin>
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        title={editing ? 'Cập nhật Coupon' : 'Thêm Coupon'}
        destroyOnClose={false}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        cancelText="Hủy"
        confirmLoading={couponState.loading}
      >
        <Form 
          form={form} 
          layout="vertical"
          initialValues={{ discount: 1 }}
        >
          <Form.Item name="name" label="Tên" rules={[{ required: true, message: 'Nhập tên coupon' }]}><Input /></Form.Item>
          <Form.Item 
            name="discount" 
            label="Giảm (%)" 
            rules={[
              { required: true, message: 'Nhập số % giảm (1-100)' },
              { type: 'number', min: 1, max: 100, message: 'Nhập số % giảm (1-100)' },
              {
                validator: (_, value) => {
                  const numValue = Number(value);
                  if (isNaN(numValue)) {
                    return Promise.reject(new Error('Phải là số'));
                  }
                  if (numValue < 1 || numValue > 100) {
                    return Promise.reject(new Error('Phải từ 1-100'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <InputNumber 
              min={1} 
              max={100} 
              onChange={(value) => {
                // Đảm bảo giá trị luôn là number
                form.setFieldValue('discount', Number(value) || 1);
              }}
            />
          </Form.Item>
          <Form.Item name="created_at" label="Ngày tạo" rules={[{ required: true, message: 'Chọn ngày tạo' }]}><DatePicker showTime format="DD/MM/YYYY HH:mm" /></Form.Item>
          <Form.Item name="expiry" label="Hết hạn" rules={[{ required: true, message: 'Chọn ngày hết hạn' }]}><DatePicker showTime format="DD/MM/YYYY HH:mm" /></Form.Item>
          <Form.Item name="is_blocked" label="Blocked" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CouponManagement; 