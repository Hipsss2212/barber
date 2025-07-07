package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.service.cart.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class DeleteCartItemController {
    private final CartService cartService;

    @DeleteMapping("/delete-items")
    public ResponseEntity<?> deleteCartItems(@RequestBody Set<Integer> cartItemIds) {
        try {
            cartService.deleteCartItem(cartItemIds);
            return ResponseEntity.ok("Đã xóa thành công các CartItem được chọn.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
