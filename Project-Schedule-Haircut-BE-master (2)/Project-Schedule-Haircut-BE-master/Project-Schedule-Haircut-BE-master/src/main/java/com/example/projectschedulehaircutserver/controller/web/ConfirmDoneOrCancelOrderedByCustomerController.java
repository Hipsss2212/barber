package com.example.projectschedulehaircutserver.controller.web;

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
@RequestMapping("/web")
@AllArgsConstructor
public class ConfirmDoneOrCancelOrderedByCustomerController {
    private OrderService orderService;

    @PutMapping("/updateOrder")
    public ResponseEntity<?> updateOrder(@RequestBody ActionOrderByCustomerRequest request){
        try {
            return ResponseEntity.status(HttpStatus.OK).body(orderService.ConfirmDoneOrCancelOrderedByCustomer(request));
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
