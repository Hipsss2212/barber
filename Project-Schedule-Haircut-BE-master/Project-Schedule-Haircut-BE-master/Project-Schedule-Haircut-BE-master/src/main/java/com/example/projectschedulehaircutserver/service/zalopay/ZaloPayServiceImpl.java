package com.example.projectschedulehaircutserver.service.zalopay;

import com.example.projectschedulehaircutserver.request.PaymentRequest;
import com.example.projectschedulehaircutserver.service.order.OrderService;
import com.example.projectschedulehaircutserver.utils.HmacUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ZaloPayServiceImpl implements ZaloPayService {

    private final Environment env;
    private final OrderService orderService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public Map<String, Object> createPayment(PaymentRequest request) throws Exception {
        Map<String, Object> params = buildPaymentParams(request);
        String macData = buildMacData(params);
        String mac = generateMac(params);
        params.put("mac", mac);

        // Debug log chi tiết
        logRequestDetails(params, macData, mac);

        String endpoint = env.getProperty("zalopay.endpoint");
        HttpPost post = new HttpPost(endpoint);
        post.setHeader("Content-Type", "application/json");
        post.setEntity(new StringEntity(objectMapper.writeValueAsString(params)));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            String responseBody = EntityUtils.toString(response.getEntity());
            System.out.println("ZaloPay response: " + responseBody);
            Map<String, Object> result = objectMapper.readValue(responseBody, Map.class);

            if (result.get("return_code") != null && (int) result.get("return_code") == 1) {
                return result;
            } else {
                throw handleZaloPayError(result);
            }
        }
    }


    @Override
    public void processPaymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, String> fields = extractRequestParams(request);

        try {
            // Verify MAC
            String receivedMac = fields.get("mac");
            if (receivedMac == null) throw new Exception("Missing MAC");

            String calculatedMac = generateCallbackMac(fields);
            if (!calculatedMac.equals(receivedMac)) throw new Exception("Invalid MAC");

            // Process payment status
            String returnCode = fields.get("return_code");
            String appTransId = fields.get("app_trans_id");
            String status = "1".equals(returnCode) ? "success" : "failure";

            if ("success".equals(status)) {
                updateOrderStatus(appTransId);
            }

            // Build redirect URL with consistent parameters like VNPay
            String redirectUrl = buildRedirectUrl(
                    status,
                    fields.get("zp_trans_id"),
                    fields.get("amount"),
                    appTransId
            );
            response.sendRedirect(redirectUrl);

        } catch (Exception e) {
            response.sendRedirect(buildRedirectUrl("error", null, null, null));
        }
    }

    private Map<String, Object> buildPaymentParams(PaymentRequest request) throws JsonProcessingException {
        // 1. Tạo app_trans_id theo chuẩn
        String appTransId = new SimpleDateFormat("yyMMdd").format(new Date()) + "_"
                + String.format("%06d", new Random().nextInt(999999));

        // 2. Chuẩn bị embed_data với đầy đủ trường bắt buộc
        Map<String, String> embedData = new LinkedHashMap<>(); // Giữ thứ tự các trường
        embedData.put("merchant", "HaircutSalon");
        embedData.put("promotioninfo", "");
        embedData.put("description", "Thanh toán đơn hàng #" + request.getOrderReferenceId()); // Trường mới bắt buộc
        embedData.put("phone", "0987654321");
        embedData.put("email", "customer@example.com");

        // 3. Chuẩn bị items
        List<Map<String, Object>> items = new ArrayList<>();
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("itemid", request.getOrderReferenceId());
        item.put("itemname", "Haircut Service");
        item.put("itemprice", request.getAmount());
        item.put("itemquantity", 1);
        items.add(item);

        // 4. Kiểm tra số tiền
        if (request.getAmount() < 1000) {
            throw new IllegalArgumentException("Số tiền tối thiểu là 1000 VND");
        }

        // 5. Tạo params với thứ tự chuẩn
        Map<String, Object> params = new LinkedHashMap<>();
        params.put("app_id", env.getProperty("zalopay.app_id"));
        params.put("app_user", "customer_" + request.getOrderReferenceId());
        params.put("app_time", System.currentTimeMillis() / 1000);
        params.put("amount", request.getAmount());
        params.put("app_trans_id", appTransId);
        params.put("description", "Payment for booking #" + request.getOrderReferenceId());
        params.put("bank_code", "zalopayapp");
        params.put("embed_data", objectMapper.writeValueAsString(embedData));
        params.put("item", objectMapper.writeValueAsString(items));
        params.put("callback_url", env.getProperty("zalopay.callback_url")); // Dùng ngrok URL

        return params;
    }

    private String buildMacData(Map<String, Object> params) {
        // Đảm bảo thứ tự chính xác theo docs ZaloPay
        return String.format("%s|%s|%s|%s|%s|%s|%s",
                params.get("app_id"),
                params.get("app_trans_id"),
                params.get("app_user"),
                params.get("amount"),
                params.get("app_time"),
                params.get("embed_data"),
                params.get("item")
        );
    }

    private void logRequestDetails(Map<String, Object> params, String macData, String mac) throws JsonProcessingException {
        System.out.println("===== ZALOPAY REQUEST DETAILS =====");
        System.out.println("Request params: " + objectMapper.writeValueAsString(params));
        System.out.println("MAC data: " + macData);
        System.out.println("Generated MAC: " + mac);
        System.out.println("===================================");
    }

    private Exception handleZaloPayError(Map<String, Object> errorResult) {
        String errorMsg = String.format("ZaloPay error [%s]: %s | Sub error [%s]: %s",
                errorResult.get("return_code"),
                errorResult.get("return_message"),
                errorResult.get("sub_return_code"),
                errorResult.get("sub_return_message"));
        System.err.println(errorMsg);
        return new Exception(errorMsg);
    }


    private String generateAppTransId(String orderRefId) {
        return new SimpleDateFormat("yyMMdd").format(new Date()) + "_" + orderRefId;
    }

    private String generateMac(Map<String, Object> params) throws Exception {
        String key1 = env.getProperty("zalopay.key1");
        return HmacUtil.HMacHex(key1, buildMacData(params));
    }

//    private String buildMacData(Map<String, Object> params) {
//        return String.format("%s|%s|%s|%s|%s|%s|%s",
//                params.get("app_id"),
//                params.get("app_trans_id"),
//                params.get("app_user"),
//                params.get("amount"),
//                params.get("app_time"),
//                params.get("embed_data"),
//                params.get("item")
//        );
//    }

    private String generateCallbackMac(Map<String, String> fields) throws Exception {
        String key2 = env.getProperty("zalopay.key2");
        String data = String.format("%s|%s|%s|%s|%s|%s",
                fields.get("app_id"),
                fields.get("app_trans_id"),
                fields.get("app_user"),
                fields.get("amount"),
                fields.get("app_time"),
                fields.get("status")
        );
        return HmacUtil.HMacHex(key2, data);
    }

    private Map<String, String> extractRequestParams(HttpServletRequest request) {
        Map<String, String> fields = new HashMap<>();
        request.getParameterNames().asIterator()
                .forEachRemaining(param -> fields.put(param, request.getParameter(param)));
        return fields;
    }

    private String buildRedirectUrl(String status, String transactionId, String amount, String appTransId) {
        return String.format("%s?status=%s&transactionId=%s&amount=%s&orderId=%s",
                env.getProperty("zalopay.return_url"),
                status,
                transactionId,
                amount,
                extractOrderIdFromAppTransId(appTransId)
        );
    }

    private String extractOrderIdFromAppTransId(String appTransId) {
        if (appTransId == null) return null;
        String[] parts = appTransId.split("_");
        return parts.length > 1 ? parts[1] : null;
    }

    private void updateOrderStatus(String appTransId) {
        try {
            String orderId = extractOrderIdFromAppTransId(appTransId);
            if (orderId != null) {
                orderService.updateBookingStatus(Integer.parseInt(orderId), 2);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to update order status", e);
        }
    }
}