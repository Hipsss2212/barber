package com.example.projectschedulehaircutserver.controller.comment;

import com.example.projectschedulehaircutserver.entity.Comment;
import com.example.projectschedulehaircutserver.service.comment.CommentService;
import com.example.projectschedulehaircutserver.response.CommentResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/feedback")
@AllArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> addFeedback(@RequestBody Map<String, Object> payload) {
        String content = (String) payload.get("content");
        Float rating = ((Number) payload.get("rating")).floatValue();
        Integer customerId = ((Number) payload.get("customer_id")).intValue();
        Comment comment = commentService.addComment(content, rating, customerId);
        CommentResponse response = CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .rating(comment.getRating())
                .customerId(comment.getCustomer().getId())
                .createdAt(comment.getCreatedAt())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<List<CommentResponse>> getFeedbackByCustomer(@PathVariable Integer customerId) {
        List<Comment> comments = commentService.getCommentsByCustomerId(customerId);
        List<CommentResponse> responses = comments.stream().map(comment -> CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .rating(comment.getRating())
                .customerId(comment.getCustomer().getId())
                .createdAt(comment.getCreatedAt())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/all")
    public ResponseEntity<List<CommentResponse>> getAllFeedback() {
        List<Comment> comments = commentService.getAllComments();
        List<CommentResponse> responses = comments.stream().map(comment -> CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .rating(comment.getRating())
                .customerId(comment.getCustomer().getId())
                .createdAt(comment.getCreatedAt())
                .build()).collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
} 