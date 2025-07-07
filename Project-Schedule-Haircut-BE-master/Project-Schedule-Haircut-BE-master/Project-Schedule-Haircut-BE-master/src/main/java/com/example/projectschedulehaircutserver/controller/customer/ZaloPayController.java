package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.request.PaymentRequest;
import com.example.projectschedulehaircutserver.service.zalopay.ZaloPayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("customer/zalopay")
@RequiredArgsConstructor
public class ZaloPayController {
    private final ZaloPayService zaloPayService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequest request) {
        try {
            Map<String, Object> response = zaloPayService.createPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating payment");
        }
    }
}
