package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.request.ActionOrderByCustomerRequest;
import com.example.projectschedulehaircutserver.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class CancelOrderController {
    private final OrderService orderService;

    @PutMapping("/cancel-order")
    public ResponseEntity<?> cancelOrder(@RequestBody ActionOrderByCustomerRequest request){
        try {
            orderService.cancelBooking(request.getOrderId(), request.getStatus());
            return ResponseEntity.status(HttpStatus.OK).body("Thành Công");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
