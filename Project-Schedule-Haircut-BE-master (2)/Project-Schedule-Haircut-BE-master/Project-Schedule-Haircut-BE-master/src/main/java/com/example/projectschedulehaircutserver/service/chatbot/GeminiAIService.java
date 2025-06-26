package com.example.projectschedulehaircutserver.service.chatbot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {
    // URL của API Gemini 2.0 (phiên bản flash)
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // API key được cấu hình từ file application.properties
    private final String apiKey;

    // Constructor để inject API key từ file cấu hình
    public GeminiAIService(@Value("${google.ai.api-key}") String apiKey) {
        this.apiKey = apiKey;
    }

    //  Gửi yêu cầu sinh nội dung từ Gemini AI với thông điệp từ người dùng
    public String generateContent(String userMessage) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> request = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", userMessage)
                            ))
                    )
            );

            String url = GEMINI_API_URL + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(request, headers),
                    Map.class
            );

            return extractResponseText(response);

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi gọi Gemini API: " + e.getMessage());
        }
    }

    // Phân tích phản hồi từ Gemini API và trích xuất văn bản
    private String extractResponseText(ResponseEntity<Map> response) {
        // Kiểm tra mã trạng thái và nội dung phản hồi
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("Response không hợp lệ từ API");
        }

        // Trích xuất nội dung từ phản hồi
        Map<String, Object> responseBody = response.getBody();

        // Trích xuất danh sách các "candidates" - tức các phản hồi gợi ý từ AI
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new RuntimeException("Không có candidates trong response");
        }

        // Lấy phản hồi đầu tiên từ danh sách candidates
        Map<String, Object> firstCandidate = candidates.get(0);

        // Trích xuất nội dung từ phản hồi đầu tiên
        Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");

        // Trích xuất phần "parts", nơi chứa văn bản thực tế
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new RuntimeException("Không có parts trong content");

        }

        // Lấy phần đầu tiên từ danh sách parts
        String text = (String) parts.get(0).get("text");

        // Trả về văn bản đã được trim (loại bỏ khoảng trắng đầu và cuối)
        return text != null ? text.trim() : "";
    }
}