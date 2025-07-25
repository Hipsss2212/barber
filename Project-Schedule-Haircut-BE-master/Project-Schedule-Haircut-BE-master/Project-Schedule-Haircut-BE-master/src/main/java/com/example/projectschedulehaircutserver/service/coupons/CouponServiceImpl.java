package com.example.projectschedulehaircutserver.service.coupons;

import com.example.projectschedulehaircutserver.entity.Coupons;
import com.example.projectschedulehaircutserver.repository.CouponsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CouponServiceImpl implements CouponService {
    @Autowired
    private CouponsRepo couponsRepo;

    @Override
    public Coupons createCoupon(Coupons coupon) {
        coupon.setCreatedAt(LocalDateTime.now());
        return couponsRepo.save(coupon);
    }

    @Override
    public Coupons updateCoupon(Integer id, Coupons coupon) {
        Coupons existing = couponsRepo.findById(id).orElseThrow();
        existing.setName(coupon.getName());
        existing.setDiscount(coupon.getDiscount());
        existing.setBlocked(coupon.isBlocked());
        existing.setExpiry(coupon.getExpiry());
        return couponsRepo.save(existing);
    }

    @Override
    public void deleteCoupon(Integer id) {
        couponsRepo.deleteById(id);
    }

    @Override
    public List<Coupons> getAllCoupons() {
        return couponsRepo.findAll();
    }

    @Override
    public Optional<Coupons> getCouponByName(String name) {
        return couponsRepo.findByName(name);
    }

    @Override
    public boolean isValidCoupon(String name) {
        Optional<Coupons> coupon = couponsRepo.findByName(name);
        return coupon.isPresent() && !coupon.get().isBlocked() && coupon.get().getExpiry().isAfter(LocalDateTime.now());
    }
} 