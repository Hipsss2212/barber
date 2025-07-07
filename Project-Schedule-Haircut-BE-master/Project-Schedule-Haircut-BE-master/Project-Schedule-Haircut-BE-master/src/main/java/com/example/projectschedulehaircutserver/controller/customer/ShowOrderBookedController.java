package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class ShowOrderBookedController {
    private OrderService orderService;

    @GetMapping("/show-ordered-0")
    public ResponseEntity<?> showOrderByCustomerStatus_0(){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(orderService.showOrderByCustomerStatus_0());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/show-ordered-1")
    public ResponseEntity<?> showOrderByCustomerStatus_1(){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(orderService.showOrderByCustomerStatus_1());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/show-ordered-2")
    public ResponseEntity<?> showOrderByCustomerStatus_2(){
        try{
            return ResponseEntity.status(HttpStatus.OK).body(orderService.showOrderByCustomerStatus_2());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
