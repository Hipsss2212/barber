package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
}
