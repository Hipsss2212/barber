import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Upload } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined, UnlockOutlined, UploadOutlined } from '@ant-design/icons';
import '../assets/css/Management.css';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// Mock data for staff
const mockStaffs = [
    {
        id: 1,
        account: {
            fullName: 'Nguyễn Thị X',
            userName: 'nguyenthi.x',
            email: 'x.nguyen@example.com',
            phone: '0987123456',
            age: 28,
            address: '123 Đường ABC, Quận 1, TP.HCM',
            avatar: 'https://example.com/avatar1.jpg',
            createdAt: '2023-01-15T10:30:00',
            updatedAt: '2023-06-20T14:45:00'
        },
        employeeType: 'HAIR_STYLIST_STAFF',
        isDeleted: false,
        times: ['08:00-12:00', '13:00-17:00']
    },
    {
        id: 2,
        account: {
            fullName: 'Trần Văn Y',
            userName: 'tranvan.y',
            email: 'y.tran@example.com',
            phone: '0912876543',
            age: 32,
            address: '456 Đường XYZ, Quận 3, TP.HCM',
            avatar: 'https://example.com/avatar2.jpg',
            createdAt: '2023-02-20T09:15:00',
            updatedAt: '2023-07-10T11:20:00'
        },
        employeeType: 'SPA_STAFF',
        isDeleted: false,
        times: ['09:00-13:00', '14:00-18:00']
    }
];

const employeeTypes = [
    { value: 'HAIR_STYLIST_STAFF', label: 'Thợ cắt tóc' },
    { value: 'SPA_STAFF', label: 'Nhân viên spa' },
];

const timeSlots = [
    { value: '08:00-12:00', label: 'Sáng (8h-12h)' },
    { value: '13:00-17:00', label: 'Chiều (13h-17h)' },
    { value: '18:00-22:00', label: 'Tối (18h-22h)' }
];

const StaffManagement = () => {
    const [staffs, setStaffs] = useState(mockStaffs);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        // Gọi API để lấy dữ liệu nhân viên thực tế
        // fetchStaffs();
    }, []);

    const handleToggleStatus = (id) => {
        setStaffs(staffs.map(staff =>
            staff.id === id ? { ...staff, isDeleted: !staff.isDeleted } : staff
        ));
        message.success('Cập nhật trạng thái thành công');
    };

    const handleDelete = (id) => {
        setStaffs(staffs.filter(staff => staff.id !== id));
        message.success('Xóa nhân viên thành công');
    };

    const handleFormSubmit = () => {
        form.validateFields().then(values => {
            const formattedValues = {
                ...values,
                account: {
                    ...values.account,
                    age: parseInt(values.account.age),
                    createdAt: values.account.createdAt?.format('YYYY-MM-DDTHH:mm:ss'),
                    updatedAt: new Date().toISOString()
                },
                times: values.times || []
            };

            if (editingId) {
                setStaffs(staffs.map(staff =>
                    staff.id === editingId ? { ...staff, ...formattedValues } : staff
                ));
                message.success('Cập nhật thành công');
            } else {
                const newStaff = {
                    id: Math.max(...staffs.map(s => s.id), 0) + 1,
                    ...formattedValues,
                    isDeleted: false
                };
                setStaffs([...staffs, newStaff]);
                message.success('Thêm mới thành công');
            }
            setIsModalVisible(false);
            form.resetFields();
        }).catch(err => {
            console.error(err);
            message.error('Vui lòng kiểm tra lại thông tin');
        });
    };

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: ['account', 'fullName'],
            key: 'fullName',
        },
        {
            title: 'Tên đăng nhập',
            dataIndex: ['account', 'userName'],
            key: 'userName',
        },
        {
            title: 'Vị trí',
            dataIndex: 'employeeType',
            key: 'position',
            render: type => employeeTypes.find(t => t.value === type)?.label
        },
        {
            title: 'SĐT',
            dataIndex: ['account', 'phone'],
            key: 'phone',
        },
        {
            title: 'Tuổi',
            dataIndex: ['account', 'age'],
            key: 'age',
        },
        {
            title: 'Ca làm việc',
            dataIndex: 'times',
            key: 'times',
            render: times => times?.map(time => (
                <Tag key={time}>{timeSlots.find(t => t.value === time)?.label || time}</Tag>
            ))
        },
        {
            title: 'Trạng thái',
            key: 'isDeleted',
            render: (_, record) => (
                <Tag color={record.isDeleted ? 'red' : 'green'}>
                    {record.isDeleted ? 'Đã khóa' : 'Hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            form.setFieldsValue({
                                employeeType: record.employeeType,
                                times: record.times,
                                account: {
                                    ...record.account,
                                    createdAt: record.account.createdAt ? dayjs(record.account.createdAt) : null
                                }
                            });
                            setEditingId(record.id);
                            setIsModalVisible(true);
                        }}
                    />
                    <Button
                        icon={record.isDeleted ? <UnlockOutlined /> : <LockOutlined />}
                        onClick={() => handleToggleStatus(record.id)}
                    />
                    <Popconfirm
                        title="Xác nhận xóa vĩnh viễn?"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Nhân viên</h2>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        form.resetFields();
                        setEditingId(null);
                        setIsModalVisible(true);
                    }}
                >
                    Thêm nhân viên
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={staffs}
                rowKey="id"
                bordered
                pagination={{ pageSize: 8 }}
            />

            <Modal
                title={editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên'}
                visible={isModalVisible}
                onOk={handleFormSubmit}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <h3>Thông tin tài khoản</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name={['account', 'fullName']}
                            label="Họ tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'userName']}
                            label="Tên đăng nhập"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
                        >
                            <Input disabled={!!editingId} />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'email']}
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { type: 'email', message: 'Email không hợp lệ' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'phone']}
                            label="Số điện thoại"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'age']}
                            label="Tuổi"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tuổi' },
                                { type: 'number', min: 18, max: 60, message: 'Tuổi phải từ 18 đến 60' }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'address']}
                            label="Địa chỉ"
                            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'createdAt']}
                            label="Ngày tạo"
                        >
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabled />
                        </Form.Item>

                        <Form.Item
                            name={['account', 'avatar']}
                            label="Ảnh đại diện"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload name="avatar" listType="picture" beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Tải lên</Button>
                            </Upload>
                        </Form.Item>
                    </div>

                    <h3>Thông tin nhân viên</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <Form.Item
                            name="employeeType"
                            label="Vị trí"
                            rules={[{ required: true, message: 'Vui lòng chọn vị trí' }]}
                        >
                            <Select options={employeeTypes} />
                        </Form.Item>

                        <Form.Item
                            name="times"
                            label="Ca làm việc"
                        >
                            <Select mode="multiple" options={timeSlots} />
                        </Form.Item>
                    </div>

                    {!editingId && (
                        <>
                            <h3>Thông tin đăng nhập</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <Form.Item
                                    name={['account', 'password']}
                                    label="Mật khẩu"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    label="Xác nhận mật khẩu"
                                    dependencies={['account', 'password']}
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue(['account', 'password']) === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu không khớp'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password />
                                </Form.Item>
                            </div>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default StaffManagement;