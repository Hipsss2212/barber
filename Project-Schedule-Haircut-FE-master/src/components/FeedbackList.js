import React, { useEffect, useState } from 'react';
import { getCommentsByEmployee } from '../services/feedbackService';

const FeedbackList = ({ employeeId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getCommentsByEmployee(employeeId).then(res => setComments(res.data));
  }, [employeeId]);

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