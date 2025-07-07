import React, { useState } from 'react';
import { addComment } from '../services/feedbackService';
import { Input, Button, Rate, message } from 'antd';

const FeedbackForm = ({ employeeId, customerId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [fullName, setFullName] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    try {
      await addComment({
        content,
        fullName,
        rating,
        employee: { id: employeeId },
        customer: { id: customerId }
      });
      message.success('Gửi feedback thành công!');
      setContent('');
      setFullName('');
      setRating(5);
      if (onSuccess) onSuccess();
    } catch {
      message.error('Gửi feedback thất bại!');
    }
  };

  return (
    <div>
      <Input placeholder="Tên của bạn" value={fullName} onChange={e => setFullName(e.target.value)} style={{marginBottom: 8}} />
      <Rate value={rating} onChange={setRating} style={{marginBottom: 8}} />
      <Input.TextArea placeholder="Nội dung feedback" value={content} onChange={e => setContent(e.target.value)} rows={3} style={{marginBottom: 8}} />
      <Button type="primary" onClick={handleSubmit}>Gửi feedback</Button>
    </div>
  );
};

export default FeedbackForm; 