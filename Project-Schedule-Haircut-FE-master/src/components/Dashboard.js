// components/Report/Report.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Select, DatePicker, Tag, Row, Col, Statistic } from 'antd';
import { Column } from '@ant-design/charts';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import '../assets/css/Management.css';  // Sử dụng CSS từ Management.css
import axiosClient from '../config/axios';

const { RangePicker } = DatePicker;

const mockData = [
    { employee: 'Nguyễn Văn A', service: 'Cắt tóc', amount: 100000, date: '2025-05-01' },
    { employee: 'Trần Thị B', service: 'Massage', amount: 150000, date: '2025-05-01' },
    { employee: 'Lê Quang C', service: 'Cắt tóc', amount: 200000, date: '2025-05-02' },
    { employee: 'Nguyễn Văn A', service: 'Gội đầu', amount: 50000, date: '2025-05-02' },
    { employee: 'Trần Thị B', service: 'Cắt tóc', amount: 120000, date: '2025-05-03' },
];

const employees = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Quang C'];
const services = ['Cắt tóc', 'Massage', 'Gội đầu'];

const Dashboard = () => {
    const [dateRange, setDateRange] = useState([]);
    const [employee, setEmployee] = useState('');
    const [service, setService] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [revenueData, setRevenueData] = useState([]);
    const [employeesList, setEmployeesList] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, [dateRange, employee, service]);

    const fetchStatistics = async () => {
        setLoading(true);
        let params = {};
        if (dateRange && dateRange.length === 2) {
            params.from = dateRange[0] && dateRange[0].format ? dateRange[0].format('YYYY-MM-DD') : dateRange[0];
            params.to = dateRange[1] && dateRange[1].format ? dateRange[1].format('YYYY-MM-DD') : dateRange[1];
        }
        if (employee) params.employee = employee;
        if (service) params.service = service;
        try {
            const res = await axiosClient.get('/admin/statistics', { params });
            setTotalRevenue(res.totalRevenue);
            setRevenueData(res.revenueByDay);
            setFilteredData(res.detailList);
            setEmployeesList(res.revenueByEmployee.map(e => e.employee));
            if (res.services) setServicesList(res.services);
        } catch (err) {
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (dates) => {
        setDateRange(dates);
    };

    const handleEmployeeChange = (value) => {
        setEmployee(value);
    };

    const handleServiceChange = (value) => {
        setService(value);
    };

    const generateReport = () => {
        // Xuất báo cáo Excel
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
        XLSX.writeFile(wb, 'BaoCaoDoanhThu.xlsx');
    };

    const generatePDF = () => {
        // Xuất báo cáo PDF
        const doc = new jsPDF();
        doc.text('Báo cáo doanh thu', 20, 20);
        filteredData.forEach((item, index) => {
            doc.text(`${item.employee} - ${item.service} - ${item.amount} VND`, 20, 30 + index * 10);
        });
        doc.save('BaoCaoDoanhThu.pdf');
    };

    const columns = [
        { title: 'Nhân viên', dataIndex: 'employee' },
        { title: 'Dịch vụ', dataIndex: 'service' },
        { title: 'Số tiền', dataIndex: 'amount' },
        { title: 'Ngày', dataIndex: 'date' },
    ];

    return (
        <div className="management-container dashboard-gradient-bg">
            <h2 className="management-header">Báo cáo thống kê</h2>
            <Row gutter={16}>
                <Col span={6}>
                    <Select
                        placeholder="Chọn nhân viên"
                        style={{ width: 200, transition: 'box-shadow 0.4s' }}
                        onChange={handleEmployeeChange}
                        className="dashboard-select"
                    >
                        {employeesList.map((employee, index) => (
                            <Select.Option key={index} value={employee}>
                                {employee}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={6}>
                    <Select
                        placeholder="Chọn dịch vụ"
                        style={{ width: 200, transition: 'box-shadow 0.4s' }}
                        onChange={handleServiceChange}
                        className="dashboard-select"
                    >
                        {servicesList.map((service, index) => (
                            <Select.Option key={index} value={service}>
                                {service}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col span={12}>
                    <RangePicker onChange={handleDateChange} style={{ width: 300, transition: 'box-shadow 0.4s' }} className="dashboard-datepicker" />
                </Col>
            </Row>

            <div style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: 600, color: '#6366f1', transition: 'color 0.4s' }}>Tổng doanh thu</h3>
                <Statistic title="Tổng doanh thu" value={totalRevenue} suffix="VND" className="dashboard-statistic" />
            </div>

            <div className="ant-column dashboard-chart" style={{ marginTop: 24 }}>
                <h3 style={{ fontWeight: 600, color: '#06b6d4', transition: 'color 0.4s' }}>Thống kê doanh thu theo ngày</h3>
                <Column 
                    data={revenueData} 
                    xField="date" 
                    yField="amount" 
                    height={300} 
                    color={["#6366f1", "#06b6d4"]}
                    animation={{ appear: { animation: 'path-in', duration: 1200, easing: 'easeOutBounce' } }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={record => `${record.employee}-${record.service}-${record.date}-${record.amount}`}
                bordered
                pagination={{ pageSize: 5 }}
                className="dashboard-table"
                loading={loading}
            />

            <div style={{ marginTop: 24 }}>
                <Button onClick={generateReport} style={{ marginRight: 16 }} className="dashboard-btn">
                    Xuất báo cáo Excel
                </Button>
                <Button onClick={generatePDF} className="dashboard-btn">Xuất báo cáo PDF</Button>
            </div>
        </div>
    );
};

export default Dashboard;
