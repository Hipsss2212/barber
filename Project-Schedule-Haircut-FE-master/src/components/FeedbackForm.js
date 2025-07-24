import React, { useState } from 'react';
import { Input, Button, Rate, message } from 'antd';
import { addFeedback } from '../services/feedbackService';

const FeedbackForm = ({ customerId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content || !rating) {
      message.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }
    if (!customerId || isNaN(Number(customerId))) {
      message.error('Không xác định được khách hàng (customerId). Vui lòng đăng nhập lại hoặc liên hệ hỗ trợ.');
      return;
    }
    setLoading(true);
    try {
      await addFeedback({
        content,
        rating,
        customer_id: customerId
      });
      message.success('Gửi feedback thành công!');
      setContent('');
      setRating(5);
      onSuccess && onSuccess();
    } catch (err) {
      message.error('Gửi feedback thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Rate value={rating} onChange={setRating} style={{marginBottom: 8}} />
      <Input.TextArea placeholder="Nội dung feedback" value={content} onChange={e => setContent(e.target.value)} rows={3} style={{marginBottom: 8}} />
      <Button type="primary" onClick={handleSubmit} loading={loading}>Gửi feedback</Button>
    </div>
  );
};

export default FeedbackForm; 