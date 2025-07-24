package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepo extends JpaRepository<Comment, Integer> {
    List<Comment> findByCustomerId(Integer customerId);
} 