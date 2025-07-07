package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.exeption.OrderException;
import com.example.projectschedulehaircutserver.request.OrderScheduleHaircutRequest;
import com.example.projectschedulehaircutserver.service.order.OrderService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class BookingScheduleHaircutController {
    private final OrderService orderService;

    @PostMapping("/booking")
    public ResponseEntity<?> bookAppointment(@RequestBody OrderScheduleHaircutRequest request) throws LoginException, OrderException {
        try {
            String message = orderService.bookingScheduleHaircut(request);
            return ResponseEntity.ok(message);
        } catch (LoginException | OrderException e) {
            throw e; // Để GlobalExceptionHandler xử lý
        } catch (Exception e) {
            throw new RuntimeException("Lỗi hệ thống khi đặt lịch", e);
        }
    }
}