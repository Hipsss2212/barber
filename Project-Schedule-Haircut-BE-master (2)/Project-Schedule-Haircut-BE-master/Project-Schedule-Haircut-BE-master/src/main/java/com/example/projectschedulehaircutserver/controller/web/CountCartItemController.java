package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.response.ServiceAndComboResponse;
import com.example.projectschedulehaircutserver.service.cart.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class CountCartItemController {
    private final CartService cartService;

    @GetMapping("/count-item")
    public ResponseEntity<?> getCountCartItem(){
        return ResponseEntity.ok(cartService.countCartItem());
    }
}
