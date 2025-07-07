package com.example.projectschedulehaircutserver.controller.maneger;

import com.example.projectschedulehaircutserver.entity.Coupons;
import com.example.projectschedulehaircutserver.repository.CouponsRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin/coupons")
@RequiredArgsConstructor
public class CouponManagementController {
    private final CouponsRepo couponsRepo;

    // Lấy danh sách coupon
    @GetMapping
    public ResponseEntity<List<Coupons>> getAllCoupons() {
        return ResponseEntity.ok(couponsRepo.findAll());
    }

    // Lấy chi tiết coupon
    @GetMapping("/{id}")
    public ResponseEntity<Coupons> getCouponById(@PathVariable Integer id) {
        Optional<Coupons> coupon = couponsRepo.findById(id);
        return coupon.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Tạo mới coupon
    @PostMapping
    public ResponseEntity<Coupons> createCoupon(@RequestBody Coupons coupon) {
        coupon.setId(null); // Đảm bảo tạo mới
        Coupons saved = couponsRepo.save(coupon);
        return ResponseEntity.ok(saved);
    }

    // Sửa coupon
    @PutMapping("/{id}")
    public ResponseEntity<Coupons> updateCoupon(@PathVariable Integer id, @RequestBody Coupons coupon) {
        if (!couponsRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        coupon.setId(id);
        Coupons updated = couponsRepo.save(coupon);
        return ResponseEntity.ok(updated);
    }

    // Xóa coupon
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Integer id) {
        if (!couponsRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        couponsRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Block/Unblock coupon
    @PatchMapping("/{id}/block")
    public ResponseEntity<Coupons> blockCoupon(@PathVariable Integer id, @RequestParam boolean block) {
        Optional<Coupons> couponOpt = couponsRepo.findById(id);
        if (couponOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Coupons coupon = couponOpt.get();
        coupon.setIsBlocked(block);
        Coupons updated = couponsRepo.save(coupon);
        return ResponseEntity.ok(updated);
    }
} 