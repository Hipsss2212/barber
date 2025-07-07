// File: VnPayController.java
package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.service.vnpay.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("customer/vnpay")
@RequiredArgsConstructor
public class VnPayController {

    private final VnPayService vnPayService;

    @GetMapping("/create")
    public Map<String, Object> createPayment(
            HttpServletRequest request,
            @RequestParam int amount,
            @RequestParam String orderInfo
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            String paymentUrl = vnPayService.createPayment(request, amount, orderInfo);
            response.put("code", "00");
            response.put("message", "Payment URL created");
            response.put("data", paymentUrl);
        } catch (Exception e) {
            response.put("code", "99");
            response.put("message", "Error creating payment: " + e.getMessage());
        }
        return response;
    }

}