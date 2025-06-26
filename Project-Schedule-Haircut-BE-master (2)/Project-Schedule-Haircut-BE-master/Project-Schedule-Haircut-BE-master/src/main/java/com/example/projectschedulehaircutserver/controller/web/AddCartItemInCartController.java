package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.CartItemException;
import com.example.projectschedulehaircutserver.exeption.ComboException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.request.AddComboInCartItemRequest;
import com.example.projectschedulehaircutserver.request.AddServiceInCartItemRequest;
import com.example.projectschedulehaircutserver.service.cart.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class AddCartItemInCartController {
    private final CartService cartService;

    @PostMapping("/add/combo")
    public ResponseEntity<?> addCombo(@RequestBody AddComboInCartItemRequest request) throws CartItemException, ComboException, LoginException {
        String message = cartService.addCartItemInCartTypeCombo(request);
        return ResponseEntity.ok(message);
    }

    @PostMapping("/add/service")
    public ResponseEntity<?> addService(@RequestBody AddServiceInCartItemRequest request) throws CartItemException, ComboException, LoginException {
        String message = cartService.addCartItemInCartTypeService(request);
        return ResponseEntity.ok(message);
    }
}
