package com.example.projectschedulehaircutserver.controller.test;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class UserController {
    @GetMapping("/test")
    public ResponseEntity<String> getText(){
        try{
            return ResponseEntity.ok("Hello Word Customer!!!");
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
