import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Space,
    Image,
    Input,
    Select,
    message,
    Popconfirm,
    Modal,
    Form,
    InputNumber,
    Spin,
    Tag,
    Upload
} from 'antd';
import {
    UploadOutlined,
    SearchOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import '../assets/css/ServiceManagement.css';
import useManagementService from '../services/managementService';

const { Search } = Input;
const { Option } = Select;

const ServiceManagement = () => {
    const { getServices, getCombos, managementState, createNewService, updateExistingService, deleteServiceAction,
        createNewCombo, updateExistingCombo, deleteComboAction
    } = useManagementService();
    const [services, setServices] = useState([]);
    const [combos, setCombos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [viewMode, setViewMode] = useState('service');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [servicesData, combosData] = await Promise.all([
                getServices(),
                getCombos()
            ]);
            setServices(servicesData);
            setCombos(combosData);
        } catch (error) {
            message.error('Lỗi khi tải dữ liệu: ' + error.message);
        }
    };


    const handleSearch = (value) => {
        setSearchText(value);
    };

    const handleCategoryFilter = (value) => {
        setSelectedCategory(value);
    };

    const handleDelete = async (id) => {
        try {
            if (viewMode === 'service') {
                await deleteServiceAction(id);
            } else {
                await deleteComboAction(id);
            }
            await fetchData();
        } catch (error) {
            console.error('Lỗi khi xóa: ' + error.message);
        }
    };

    const openAddModal = () => {
        setEditingItem(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const openEditModal = (record) => {
        setEditingItem(record);
        form.setFieldsValue({
            name: record.name,
            price: record.price,
            ...(viewMode === 'service' ? {
                haircutTime: record.haircutTime,
                categoryId: record.category?.id,
            } : {
                services: record.services,
                categoryId: record.category?.id
            }),
            image: record.image ? [{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: record.image,
            }] : [],
        });
        setIsModalOpen(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('price', values.price);
            formData.append('categoryId', values.categoryId); // Thêm categoryId cho cả service và combo

            if (viewMode === 'service') {
                formData.append('haircutTime', values.haircutTime);
            } else {
                values.services.forEach((id) => {
                    formData.append('services', id.toString());
                });
            }

            // Xử lý file ảnh
            if (values.image && values.image[0]?.originFileObj) {
                formData.append('file', values.image[0].originFileObj);
            } else if (editingItem?.image) {
                formData.append('imageUrl', editingItem.image);
            }

            if (viewMode === 'service') {
                if (editingItem) {
                    await updateExistingService(editingItem.id, formData);
                } else {
                    await createNewService(formData);
                }
            } else {
                if (editingItem) {
                    await updateExistingCombo(editingItem.id, formData);
                } else {
                    await createNewCombo(formData);
                }
            }

            await fetchData();
            setIsModalOpen(false);

            await fetchData();
            setIsModalOpen(false);
        } catch (error) {
            message.error(error.message || 'Có lỗi xảy ra');
            console.error('Error:', error);
        }
    };


    const filteredServices = services.filter(service => {
        const matchName = service.name.toLowerCase().includes(searchText.toLowerCase());
        const matchCategory = selectedCategory
            ? service.category?.id.toString() === selectedCategory // So sánh ID dạng string
            : true;
        return matchName && matchCategory;
    });

    const filteredCombos = combos.filter(combo => {
        return combo.name.toLowerCase().includes(searchText.toLowerCase());
    });

    const serviceColumns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image) => <Image src={image} width={80} />,
        },
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price) => price.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'haircutTime',
            render: (time) => `${time} phút`,
            sorter: (a, b) => a.haircutTime - b.haircutTime,
        },
        {
            title: 'Danh mục',
            dataIndex: ['category', 'id'], // Hiển thị id thay vì name
            render: (categoryId) => {
                const categoryName = categoryId === 1 ? 'Cắt tóc' :
                    categoryId === 2 ? 'Uốn tóc' :
                        categoryId === 3 ? 'Nhuộm tóc' :
                            categoryId === 4 ? 'Spa & Massage Relax' :
                                'Khác';
                return (
                    <Tag color={categoryId === 1 ? 'blue' : 'purple'}>
                        {categoryName}
                    </Tag>
                );
            },
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const comboColumns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (image) => <Image src={image} width={80} />,
        },
        {
            title: 'Tên combo',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            render: (price) => price.toLocaleString('vi-VN') + ' đ',
            sorter: (a, b) => a.price - b.price,
        },
        // {
        //     title: 'Danh mục',
        //     dataIndex: ['category', 'id'],
        //     render: (categoryId) => {
        //         const categoryName = categoryId === 1 ? 'Cắt tóc' :
        //             categoryId === 2 ? 'Uốn tóc' :
        //                 categoryId === 3 ? 'Nhuộm tóc' :
        //                     categoryId === 4 ? 'Spa & Massage Relax' :
        //                         'Khác';
        //         return (
        //             <Tag color={categoryId === 1 ? 'blue' : 'purple'}>
        //                 {categoryName}
        //             </Tag>
        //         );
        //     },
        // },
        {
            title: 'Dịch vụ bao gồm',
            dataIndex: 'services',
            render: (servicesIds) => (
                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {servicesIds.map(id => {
                        const service = services.find(s => s.id === id);
                        return (
                            <Tag key={id} color="cyan" style={{ marginBottom: 4 }}>
                                {service?.name || `Dịch vụ #${id}`}
                            </Tag>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    />
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="management-container">
            <div className="management-header">
                <h2>Quản lý Dịch vụ {viewMode === 'combo' && 'và Combo'}</h2>
                <Space>
                    <Input.Search
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        style={{ width: 300 }}
                        onSearch={handleSearch}
                        allowClear
                        disabled={managementState.loading}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openAddModal}
                        disabled={managementState.loading}
                    >
                        Thêm mới
                    </Button>
                </Space>
            </div>

            <Space style={{ marginBottom: 16 }}>
                <Select
                    value={viewMode}
                    onChange={setViewMode}
                    style={{ width: 200 }}
                    disabled={managementState.loading}
                >
                    <Option value="service">Dịch vụ</Option>
                    <Option value="combo">Combo</Option>
                </Select>

                {viewMode === 'service' && (
                    <Select
                        placeholder="Tất cả danh mục"
                        allowClear
                        style={{ width: 200 }}
                        onChange={handleCategoryFilter}
                        disabled={managementState.loading}
                    >
                        <Option value="1">Cắt tóc</Option>
                        <Option value="2">Uốn tóc</Option>
                        <Option value="3">Nhuộm tóc</Option>
                        <Option value="4">Spa & Massage Relax</Option>
                    </Select>
                )}
            </Space>

            <Spin spinning={managementState.loading}>
                <Table
                    columns={viewMode === 'service' ? serviceColumns : comboColumns}
                    dataSource={viewMode === 'service' ? filteredServices : filteredCombos}
                    rowKey="id"
                    bordered
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        showTotal: (total) => `Tổng ${total} mục`
                    }}
                    scroll={{ x: true }}
                />
            </Spin>

            <Modal
                title={editingItem ? `Chỉnh sửa ${viewMode === 'service' ? 'dịch vụ' : 'combo'}` : `Thêm ${viewMode === 'service' ? 'dịch vụ' : 'combo'} mới`}
                open={isModalOpen}
                onOk={handleModalOk}
                onCancel={() => setIsModalOpen(false)}
                okText={editingItem ? 'Cập nhật' : 'Thêm mới'}
                cancelText="Hủy"
                confirmLoading={managementState.loading}
                width={700}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Tên"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder={`Nhập tên ${viewMode === 'service' ? 'dịch vụ' : 'combo'}`} />
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    {viewMode === 'service' && (
                        <>
                            <Form.Item
                                label="Thời gian thực hiện (phút)"
                                name="haircutTime"
                                rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                            >
                                <InputNumber style={{ width: '100%' }} min={5} max={180} />
                            </Form.Item>

                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    <Option value={1}>Cắt tóc</Option>
                                    <Option value={2}>Uốn tóc</Option>
                                    <Option value={3}>Nhuộm tóc</Option>
                                    <Option value={4}>Spa & Massage Relax</Option>
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    {viewMode === 'combo' && (
                        <>
                            <Form.Item
                                label="Danh mục"
                                name="categoryId"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select placeholder="Chọn danh mục">
                                    <Option value={1}>Cắt tóc</Option>
                                    <Option value={2}>Uốn tóc</Option>
                                    <Option value={3}>Nhuộm tóc</Option>
                                    <Option value={4}>Spa & Massage Relax</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Dịch vụ bao gồm"
                                name="services"
                                rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 dịch vụ!' }]}
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Chọn dịch vụ"
                                    optionFilterProp="children"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.props.children[0].props.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    optionLabelProp="label"
                                    style={{ width: '100%' }}
                                    dropdownRender={(menu) => (
                                        <div>
                                            <div style={{ padding: '8px 12px', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}>
                                                Danh sách dịch vụ ({services.length})
                                            </div>
                                            {menu}
                                        </div>
                                    )}
                                >
                                    {services.map(service => (
                                        <Option
                                            key={service.id}
                                            value={service.id}
                                            label={service.name}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>
                                                    <span style={{ fontWeight: 500 }}>{service.name}</span>
                                                    <div style={{ fontSize: 12, color: '#666' }}>
                                                        {service.category?.name && `${service.category.name} • `}
                                                        {service.haircutTime} phút
                                                    </div>
                                                </div>
                                                <div style={{ color: '#1890ff', fontWeight: 500 }}>
                                                    {service.price.toLocaleString('vi-VN')}đ
                                                </div>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </>
                    )}

                    <Form.Item
                        label="Hình ảnh"
                        name="image"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => {
                            // Xử lý khi có file được chọn
                            if (Array.isArray(e)) {
                                return e;
                            }
                            return e && e.fileList;
                        }}
                        rules={[{ required: !editingItem, message: 'Vui lòng tải ảnh lên!' }]}
                    >
                        <Upload
                            name="file"
                            listType="picture-card"
                            beforeUpload={() => false} // Luôn trả về false để tự xử lý upload
                            maxCount={1}
                            accept="image/*"
                        >
                            {form.getFieldValue('image')?.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Tải lên</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ServiceManagement;