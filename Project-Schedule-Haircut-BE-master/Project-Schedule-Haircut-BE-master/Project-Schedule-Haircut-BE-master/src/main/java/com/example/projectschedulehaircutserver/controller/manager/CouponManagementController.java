package com.example.projectschedulehaircutserver.controller.manager;

import com.example.projectschedulehaircutserver.entity.Coupons;
import com.example.projectschedulehaircutserver.service.coupons.CouponService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@AllArgsConstructor
public class CouponManagementController {
    private final CouponService couponService;

    @GetMapping
    public List<Coupons> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @PostMapping
    public Coupons createCoupon(@RequestBody Coupons coupon) {
        return couponService.createCoupon(coupon);
    }

    @PutMapping("/{id}")
    public Coupons updateCoupon(@PathVariable Integer id, @RequestBody Coupons coupon) {
        return couponService.updateCoupon(id, coupon);
    }

    @DeleteMapping("/{id}")
    public void deleteCoupon(@PathVariable Integer id) {
        couponService.deleteCoupon(id);
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String name) {
        boolean valid = couponService.isValidCoupon(name);
        return ResponseEntity.ok(Map.of("valid", valid));
    }
} 