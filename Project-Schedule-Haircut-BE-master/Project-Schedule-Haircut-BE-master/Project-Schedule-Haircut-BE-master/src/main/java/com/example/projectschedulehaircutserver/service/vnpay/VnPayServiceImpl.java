// File: VnPayServiceImpl.java
package com.example.projectschedulehaircutserver.service.vnpay;

import com.example.projectschedulehaircutserver.config.VnPayConfig;
import com.example.projectschedulehaircutserver.service.order.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnPayServiceImpl implements VnPayService {
    private final VnPayConfig vnPayConfig;
    private final OrderService orderService;

    // Tạo URL thanh toán
    @Override
    public String createPayment(HttpServletRequest request, int amount, String orderInfo) {
        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnPayConfig.getVnpTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));
        vnpParams.put("vnp_OrderInfo", orderInfo);
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnPayConfig.getVnpCallback());
        vnpParams.put("vnp_IpAddr", vnPayConfig.getIpAddress(request));

        Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        vnpParams.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(calendar.getTime()));

        calendar.add(Calendar.MINUTE, 15);
        vnpParams.put("vnp_ExpireDate", new SimpleDateFormat("yyyyMMddHHmmss").format(calendar.getTime()));

        return vnPayConfig.buildPaymentUrl(vnpParams);
    }

    // Xử lý callback từ VNPay
    @Override
    public void processPaymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> fields = new HashMap<>();
        request.getParameterNames().asIterator()
                .forEachRemaining(param -> fields.put(param, request.getParameter(param)));

        String vnpSecureHash = fields.remove("vnp_SecureHash");
        String signValue = vnPayConfig.hmacSHA512(buildQueryString(fields));

        if (signValue.equalsIgnoreCase(vnpSecureHash)) {
            handleSuccessfulPayment(fields, response);
        } else {
            handleFailedPayment(response);
        }
    }


    // Tạo chuỗi query string từ Map (key=value&key2=value2...) đã sắp xếp theo key
    private String buildQueryString(Map<String, String> fields) {
        return fields.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> encodeParameter(entry.getKey(), entry.getValue()))
                .reduce((a, b) -> a + "&" + b)
                .orElse("");
    }

    // Mã hóa tham số key=value
    private String encodeParameter(String key, String value) {
        try {
            return URLEncoder.encode(key, StandardCharsets.UTF_8.toString()) + "=" +
                    URLEncoder.encode(value, StandardCharsets.UTF_8.toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Encoding error", e);
        }
    }

    // Xử lý thanh toán thành công
    private void handleSuccessfulPayment(Map<String, String> fields, HttpServletResponse response) throws IOException {
        String status = determinePaymentStatus(fields);
        String redirectUrl = buildRedirectUrl(fields, status);
        updateOrderStatus(fields.get("vnp_OrderInfo"));
        response.sendRedirect(redirectUrl); // Redirect đến frontend
    }

    // Xác định trạng thái thanh toán dựa vào mã phản hồi và mã trạng thái giao dịch từ VNPay
    private String determinePaymentStatus(Map<String, String> fields) {
        return "00".equals(fields.get("vnp_ResponseCode")) &&
                "00".equals(fields.get("vnp_TransactionStatus")) ? "success" : "failure";
    }

    //  Tạo URL chuyển hướng về frontend kèm theo thông tin trạng thái, mã giao dịch và số tiền
    private String buildRedirectUrl(Map<String, String> fields, String status) {
        // Sử dụng URL frontend đã cấu hình trong vnpReturnUrl
        return String.format("%s?status=%s&transactionId=%s&amount=%s",
                vnPayConfig.getVnpReturnUrl(), // Đã trỏ đến frontend
                status,
                fields.get("vnp_TransactionNo"),
                fields.get("vnp_Amount"));
    }

    // Cập nhật trạng thái đơn hàng trong hệ thống
    private void updateOrderStatus(String orderInfo) {
        // Giả sử orderInfo có dạng "Payment for booking #123"
        String[] parts = orderInfo.split("#");
        if (parts.length > 1) {
            String bookingId = parts[1].trim();
            orderService.updateBookingStatus(Integer.parseInt(bookingId), 2);
        } else {
            // Xử lý trường hợp không có bookingId
        }
    }

    // Xử lý thanh toán thất bại
    private void handleFailedPayment(HttpServletResponse response) throws IOException {
        response.sendRedirect(vnPayConfig.getVnpReturnUrl() + "?status=error");
    }
}