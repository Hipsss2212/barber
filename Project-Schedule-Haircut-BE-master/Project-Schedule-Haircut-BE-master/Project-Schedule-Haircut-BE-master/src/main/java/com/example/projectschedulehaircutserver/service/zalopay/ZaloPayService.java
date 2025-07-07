package com.example.projectschedulehaircutserver.service.zalopay;

import com.example.projectschedulehaircutserver.request.PaymentRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.Map;

public interface ZaloPayService {
    Map<String, Object> createPayment(PaymentRequest request) throws Exception;

    void processPaymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
