package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.RegisterException;
import com.example.projectschedulehaircutserver.request.RegisterRequest;
import com.example.projectschedulehaircutserver.service.authentication.AuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class RegisterController {
    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register_customer(@RequestBody RegisterRequest userRegisterRequest) throws RegisterException {
        String message = authenticationService.registerUser(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PostMapping("/api/auth/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String result = authenticationService.verifyEmail(token);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/api/auth/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String result = authenticationService.resendVerificationCode(email);
        return ResponseEntity.ok(result);
    }
}
