package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Coupons;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CouponsRepo extends JpaRepository<Coupons, Integer> {
    @Query(value = "SELECT c2.* " +
            "FROM customer AS c " +
            "JOIN coupons_customer AS cc ON c.id = cc.customer_id " +
            "JOIN coupons AS c2 ON cc.coupon_id = c2.id " +
            "WHERE c.id = :customerId", nativeQuery = true)
    Optional<Coupons> findCouponByCustomerId(@Param("customerId") Integer customerId);

    @Query("select c from Coupons c where c.isBlocked = false and DATE(c.expiry) = CURDATE()")
    List<Coupons> findCouponsByExpiryAndIsBlocked();
}
