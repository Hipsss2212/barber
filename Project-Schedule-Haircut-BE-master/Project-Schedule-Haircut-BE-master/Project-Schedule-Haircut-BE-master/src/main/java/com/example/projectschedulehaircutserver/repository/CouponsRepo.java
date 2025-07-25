package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Coupons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CouponsRepo extends JpaRepository<Coupons, Integer> {
    Optional<Coupons> findByName(String name);
    @Query("SELECT c FROM Coupons c WHERE c.isBlocked = false AND c.expiry > :now")
    List<Coupons> findValidCoupons(@Param("now") LocalDateTime now);
} 