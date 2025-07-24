import React, { useEffect, useState } from 'react';
import { getCommentsByEmployee } from '../services/feedbackService';

const FeedbackList = ({ employeeId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    getCommentsByEmployee(employeeId)
      .then(res => setComments(res))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [employeeId]);

  if (loading) return <div>Đang tải feedback...</div>;
  if (!comments.length) return <div>Chưa có feedback nào.</div>;

  return (
    <div>
      <h3>Feedback</h3>
      {comments.map(c => (
        <div key={c.id} style={{borderBottom: '1px solid #eee', marginBottom: 8}}>
          <b>{c.fullName}</b> - <span>Rating: {c.rating}</span>
          <div>{c.content}</div>
          <small>{new Date(c.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};

export default FeedbackList; 