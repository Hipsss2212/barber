package com.example.projectschedulehaircutserver.service.vnpay;

import com.example.projectschedulehaircutserver.config.VnPayConfig;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public interface VnPayService {
    String createPayment(HttpServletRequest request, int amount, String orderInfo);
    void processPaymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException;
}