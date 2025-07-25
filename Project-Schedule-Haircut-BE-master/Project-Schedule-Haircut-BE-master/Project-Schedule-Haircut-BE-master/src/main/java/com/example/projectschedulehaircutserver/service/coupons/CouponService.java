package com.example.projectschedulehaircutserver.service.coupons;

import com.example.projectschedulehaircutserver.entity.Coupons;
import java.util.List;
import java.util.Optional;

public interface CouponService {
    Coupons createCoupon(Coupons coupon);
    Coupons updateCoupon(Integer id, Coupons coupon);
    void deleteCoupon(Integer id);
    List<Coupons> getAllCoupons();
    Optional<Coupons> getCouponByName(String name);
    boolean isValidCoupon(String name);
} 