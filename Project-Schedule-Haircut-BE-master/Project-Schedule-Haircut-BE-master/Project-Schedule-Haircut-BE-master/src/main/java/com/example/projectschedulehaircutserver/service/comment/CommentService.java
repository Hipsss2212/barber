package com.example.projectschedulehaircutserver.service.comment;

import com.example.projectschedulehaircutserver.entity.Comment;
import java.util.List;

public interface CommentService {
    Comment addComment(String content, Float rating, Integer customerId);
    List<Comment> getCommentsByCustomerId(Integer customerId);
    List<Comment> getAllComments();
} 