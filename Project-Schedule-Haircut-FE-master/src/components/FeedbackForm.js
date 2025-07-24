import React, { useState } from 'react';
import { addComment } from '../services/feedbackService';
import { Input, Button, Rate, message } from 'antd';

const FeedbackForm = ({ employeeId, customerId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [fullName, setFullName] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!content || !fullName || !rating) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!customerId || isNaN(Number(customerId))) {
      message.error('Không xác định được khách hàng (customerId). Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.');
      console.error('customerId không hợp lệ:', customerId);
      return;
    }
    if (!employeeId || isNaN(Number(employeeId))) {
      message.error('Không xác định được nhân viên (employeeId). Vui lòng thử lại.');
      console.error('employeeId không hợp lệ:', employeeId);
      return;
    }
    setLoading(true);
    try {
      // Log dữ liệu gửi lên để debug
      console.log('Gửi feedback với dữ liệu:', {
        content,
        fullName,
        rating,
        customer: { id: customerId },
        employee: { id: employeeId }
      });
      await addComment({
        content,
        fullName,
        rating,
        customer: { id: customerId },
        employee: { id: employeeId }
      });
      message.success('Gửi feedback thành công!');
      setContent('');
      setFullName('');
      setRating(5);
      onSuccess && onSuccess();
    } catch (err) {
      message.error('Gửi feedback thất bại!');
      console.error('Lỗi gửi feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input placeholder="Tên của bạn" value={fullName} onChange={e => setFullName(e.target.value)} style={{marginBottom: 8}} />
      <Rate value={rating} onChange={setRating} style={{marginBottom: 8}} />
      <Input.TextArea placeholder="Nội dung feedback" value={content} onChange={e => setContent(e.target.value)} rows={3} style={{marginBottom: 8}} />
      <Button type="primary" onClick={handleSubmit} loading={loading}>Gửi feedback</Button>
    </div>
  );
};

export default FeedbackForm; 