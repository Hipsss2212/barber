package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.request.PaymentRequest;
import com.example.projectschedulehaircutserver.service.vnpay.VnPayService;
import com.example.projectschedulehaircutserver.service.zalopay.ZaloPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/web/payment")
@RequiredArgsConstructor
public class PaymentReturnController {
    private final VnPayService vnPayService;
    private final ZaloPayService zaloPayService;

    @GetMapping("/vnpay/return")
    public void handlePaymentVNPayReturn(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        vnPayService.processPaymentReturn(request, response);
    }

    @GetMapping("/zalopay/return")
    public void handlePaymentZaloPayReturn(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        zaloPayService.processPaymentReturn(request, response);
    }

    @PostMapping("/test-payment")
    public ResponseEntity<?> testPayment() {
        PaymentRequest request = new PaymentRequest();
        request.setAmount(10000); // thử số tiền nhỏ
        request.setOrderReferenceId("123456"); // tạo mã order test

        try {
            Map<String, Object> response = zaloPayService.createPayment(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // in chi tiết lỗi ra console
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

}
