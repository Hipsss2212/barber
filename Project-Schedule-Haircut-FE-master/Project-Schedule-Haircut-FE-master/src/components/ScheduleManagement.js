import React, { useState, useEffect } from 'react';
import { Select, Button, message, List, Spin, Card, Tag } from 'antd';
import { PlusOutlined, ScheduleOutlined } from '@ant-design/icons';
import moment from 'moment';
import '../assets/css/Management.css';
import useManagementService from '../services/managementService';

const ScheduleManagement = () => {
    const { getAccounts, getAllTimes, managementState, addTime, removeTime } = useManagementService();
    const [staffMembers, setStaffMembers] = useState([]);
    const [staffTimes, setStaffTimes] = useState({});
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                // Fetch staff accounts
                const staffResponse = await getAccounts();
                const staffData = staffResponse.reduce((acc, staff) => {
                    if (staff.type === "STAFF") {
                        acc.members.push({
                            id: staff.id,
                            name: staff.account.fullName,
                        });
                        acc.times[staff.id] = staff.times || [];
                    }
                    return acc;
                }, { members: [], times: {} });

                setStaffMembers(staffData.members);
                setStaffTimes(staffData.times);

                const timesResponse = await getAllTimes();
                setAvailableTimes(timesResponse);

            } catch (error) {
                message.error("Lỗi tải dữ liệu");
                console.error("Fetch data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);
    console.log(availableTimes);
    console.log(selectedTime);


    const handleAddTime = async () => {
        if (!selectedStaff || !selectedTime) {
            message.warning('Vui lòng chọn nhân viên và giờ làm');
            return;
        }

        try {
            // Tìm time object từ selectedTime (value là timeName)
            const timeObj = availableTimes.find(t => t.timeName === selectedTime);

            if (!timeObj) {
                throw new Error('Khung giờ không tồn tại');
            }

            await addTime(timeObj.id, selectedStaff);

            // Cập nhật UI
            setStaffTimes(prev => ({
                ...prev,
                [selectedStaff]: [...(prev[selectedStaff] || []), selectedTime]
            }));

            setSelectedTime(null);
        } catch (error) {
            message.error(error.message);
        }
    };

    const handleRemoveTime = async (timeToRemove) => {
        if (!selectedStaff) return;

        try {
            // Tìm time object từ timeToRemove (timeName)
            const timeObj = availableTimes.find(t => t.timeName === timeToRemove);
            if (!timeObj) {
                throw new Error('Khung giờ không tồn tại');
            }

            // Gọi API xóa khung giờ với timeId
            await removeTime(timeObj.id, selectedStaff);

            // Cập nhật UI
            setStaffTimes(prev => ({
                ...prev,
                [selectedStaff]: prev[selectedStaff].filter(t => t !== timeToRemove)
            }));

        } catch (error) {
            message.error(error.message || 'Xóa giờ làm thất bại');
        }
    };


    return (
        <div className="management-container">
            <Card
                title={
                    <div className="header-title">
                        <ScheduleOutlined style={{ marginRight: 12, color: '#1890ff' }} />
                        <span>Quản lý Lịch làm việc</span>
                    </div>
                }
                variant="borderless"
                styles={{ header: { borderBottom: '1px solid #f0f0f0' } }}
            >
                <Spin spinning={loading || managementState.loading}>
                    <div className="schedule-controls">
                        <div className="staff-selector">
                            <Select
                                placeholder="Chọn nhân viên"
                                style={{ width: '100%' }}
                                value={selectedStaff}
                                onChange={setSelectedStaff}
                                options={staffMembers.map(staff => ({
                                    value: staff.id,
                                    label: staff.name
                                }))}
                                optionFilterProp="label"
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().includes(input.toLowerCase())
                                }
                            />
                        </div>

                        <div className="time-picker-section">
                            <Select
                                placeholder="Chọn khung giờ"
                                style={{ width: '100%' }}
                                value={selectedTime}
                                onChange={setSelectedTime}
                                options={availableTimes.map(time => ({
                                    value: time.timeName,
                                    label: time.timeName
                                }))}
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.includes(input)
                                }
                            />
                        </div>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddTime}
                            disabled={!selectedStaff || !selectedTime}
                            className="add-button"
                            block
                        >
                            Thêm khung giờ
                        </Button>
                    </div>

                    {selectedStaff && (
                        <Card
                            className="schedule-list"
                            title={
                                <div className="schedule-title">
                                    <span>Lịch làm việc của </span>
                                    <Tag color="blue">
                                        {staffMembers.find(s => s.id === selectedStaff)?.name}
                                    </Tag>
                                </div>
                            }
                        >
                            <List
                                grid={{ gutter: 16, column: 2 }}
                                dataSource={staffTimes[selectedStaff] || []}
                                renderItem={time => (
                                    <List.Item>
                                        <div className="time-slot">
                                            <span className="time-text">{time}</span>
                                            <Button
                                                type="link"
                                                danger
                                                onClick={() => handleRemoveTime(time)}
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </List.Item>
                                )}
                                locale={{ emptyText: 'Chưa có lịch làm việc' }}
                            />
                        </Card>
                    )}
                </Spin>
            </Card>
        </div>
    );
};

export default ScheduleManagement;