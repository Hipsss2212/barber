package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepo extends JpaRepository<Cart, Integer> {

    Optional<Cart> findCartByCustomerId(Integer id);
}
