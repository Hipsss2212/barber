package com.example.projectschedulehaircutserver.controller.chatbot;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.service.chatbot.GeminiAIService;
import com.example.projectschedulehaircutserver.service.combo.ComboService;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import com.example.projectschedulehaircutserver.service.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/web/chatbot")
@AllArgsConstructor
public class ChatBotController {
    private final GeminiAIService geminiAIService;
    private final ProductService productService;
    private final ComboService comboService;
    private final EmployeeService employeeService;

    @PostMapping("/ask")
    public ResponseEntity<String> handleChatRequest(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response;

        if (userMessage == null || userMessage.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng nhập câu hỏi của bạn");
        }

        String lowerMessage = userMessage.toLowerCase();

        if (containsAny(lowerMessage, "kiểu tóc", "khuôn mặt", "tóc", "mặt", "phù hợp", "cắt tóc", "gợi ý")) {
            response = handleHairStyleRequest(userMessage);
        } else if (containsAny(lowerMessage, "dịch vụ", "service", "giá", "bảng giá", "chi phí")) {
            response = handleServiceInquiry();
        }  else if (containsAny(lowerMessage, "nhân viên", "stylist", "thợ", "người làm","tay nghề")) {
            response = handleEmployeeInquiry();
        } else {
            response = handleGeneralQuestion(userMessage);
        }

        return ResponseEntity.ok(response);
    }

    private boolean containsAny(String input, String... keywords) {
        for (String keyword : keywords) {
            if (input.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String handleHairStyleRequest(String userMessage) {
        if (containsFaceDescription(userMessage)) {
            return generateHairStyleRecommendation(userMessage);
        } else {
            // Nếu không có mô tả khuôn mặt, yêu cầu người dùng cung cấp
            return """
                Để gợi ý kiểu tóc phù hợp, vui lòng mô tả khuôn mặt của bạn bao gồm:
                - Hình dáng khuôn mặt (tròn, vuông, oval, trái tim...)
                - Đặc điểm nổi bật (trán cao/rộng, cằm nhọn/tròn, gò má...)
                - Kiểu tóc hiện tại (nếu có)
                Ví dụ: "Mặt tôi hình oval, trán cao, gò má rộng, tóc hiện tại dài ngang vai"
                """;
        }
    }

    private boolean containsFaceDescription(String message) {
        String[] faceKeywords = {"tròn", "vuông", "oval", "dài", "trái tim", "trán", "cằm", "gò má", "mũi", "tóc"};
        for (String keyword : faceKeywords) {
            if (message.toLowerCase().contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private String generateHairStyleRecommendation(String description) {
        String prompt = """
            Bạn là chuyên gia tóc tại Boss Barber. Dựa trên mô tả khuôn mặt sau, hãy gợi ý 3 kiểu tóc phù hợp nhất:
            
            **Mô tả khuôn mặt:**
            %s
            
            **Yêu cầu định dạng câu trả lời:**
            ✂️ **Gợi ý kiểu tóc phù hợp**
            
            🔹 [Tên kiểu tóc 1]
            
            🔹 [Tên kiểu tóc 2]
            
            🔹 [Tên kiểu tóc 3]
            
            **Lưu ý:**
            - Giải thích ngắn gọn tại sao phù hợp với khuôn mặt
            """.formatted(description);

        return geminiAIService.generateContent(prompt);
    }

    private String handleServiceInquiry() {
        Set<ServiceDTO> services = productService.findAllService();
        Set<ComboDTO> combos = comboService.findAllCombo();

        String prompt = """
        Bạn là trợ lý Boss Barber. Hãy trình bày thông tin dịch vụ theo định dạng sau:
    
        **DANH SÁCH DỊCH VỤ**
        %s
    
        **DANH SÁCH COMBO**
        %s
    
        Yêu cầu:
        - Mỗi dịch vụ/combo trên 1 dòng
        - Định dạng: Tên - Giá - Thời gian thực hiện
        - Sắp xếp theo thứ tự giá tăng dần
        """.formatted(
                services.stream()
                        .sorted(Comparator.comparing(ServiceDTO::getPrice))
                        .map(s -> String.format("- %s: %d VND (%d phút)", s.getName(), s.getPrice().intValue(), s.getHaircutTime()))
                        .collect(Collectors.joining("\n")),
                combos.stream()
                        .sorted(Comparator.comparing(ComboDTO::getPrice))
                        .map(c -> String.format("- %s: %d VND (%d phút)", c.getName(), c.getPrice().intValue(), c.getHaircutTime()))
                        .collect(Collectors.joining("\n"))
        );

        return geminiAIService.generateContent(prompt);
    }

    private String handleEmployeeInquiry() {
        Set<EmployeeDTO> employees = employeeService.showAllEmployee();

        if (employees.isEmpty()) {
            return "Hiện tại chưa có thông tin nhân viên.";
        }

        String prompt = """
            Bạn là trợ lý Boss Barber. Hãy trình bày thông tin nhân viên theo định dạng sau:
            
            **DANH SÁCH NHÂN VIÊN**
            %s
            
            Yêu cầu:
            - Mỗi nhân viên trên 1 dòng
            - Định dạng: Tên - Vị trí - Số điện thoại
            - Nhóm theo loại nhân viên
            """.formatted(
                employees.stream()
                        .sorted(Comparator.comparing(EmployeeDTO::getType))
                        .map(e -> {
                            String position = e.getType() == 0
                                    ? "Nhân viên cắt tóc"
                                    : "Nhân viên spa";
                            return String.format("- %s: %s - %s",
                                    e.getFullName(),
                                    position,
                                    e.getPhone());
                        })
                        .collect(Collectors.joining("\n"))
        );

        return geminiAIService.generateContent(prompt);
    }

    private String handleGeneralQuestion(String userMessage) {
        String prompt = """
            Bạn là trợ lý Boss Barber. Trả lời ngắn gọn (dưới 30 từ):
            
            "%s"
            """.formatted(userMessage);

        return geminiAIService.generateContent(prompt);
    }
}