package com.example.projectschedulehaircutserver.service.comment;

import com.example.projectschedulehaircutserver.entity.Comment;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.repository.CommentRepo;
import com.example.projectschedulehaircutserver.repository.CustomerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private CustomerRepo customerRepo;

    @Override
    public Comment addComment(String content, Float rating, Integer customerId) {
        Customer customer = customerRepo.findById(customerId).orElseThrow(() -> new RuntimeException("Customer not found"));
        Comment comment = Comment.builder()
                .content(content)
                .rating(rating)
                .customer(customer)
                .build();
        return commentRepo.save(comment);
    }

    @Override
    public List<Comment> getCommentsByCustomerId(Integer customerId) {
        return commentRepo.findByCustomerId(customerId);
    }

    @Override
    public List<Comment> getAllComments() {
        return commentRepo.findAll();
    }
} 