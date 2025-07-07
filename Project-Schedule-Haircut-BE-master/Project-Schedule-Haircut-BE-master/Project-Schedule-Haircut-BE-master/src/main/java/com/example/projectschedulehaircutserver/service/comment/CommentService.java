package com.example.projectschedulehaircutserver.service.comment;

import com.example.projectschedulehaircutserver.entity.Comment;
import java.util.List;

public interface CommentService {
    List<Comment> getCommentsByEmployee(Integer employeeId);
    Comment addComment(Comment comment);
} 