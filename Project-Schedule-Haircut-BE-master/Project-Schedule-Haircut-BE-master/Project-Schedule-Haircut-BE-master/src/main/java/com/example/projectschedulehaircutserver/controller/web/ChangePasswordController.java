package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.request.ChangePasswordRequest;
import com.example.projectschedulehaircutserver.request.OTPRequest;
import com.example.projectschedulehaircutserver.service.authentication.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/web/password")
@RequiredArgsConstructor
public class ChangePasswordController {

    private final AuthenticationService authenticationService;

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestChangePassword(@RequestBody OTPRequest request) throws CustomerException {
        String result = authenticationService.requestChangePassword(request.getEmail());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/change")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) throws CustomerException {
        String result = authenticationService.changePassword(
                    request.getEmail(),
                    request.getCode(),
                    request.getNewPassword()
        );
        return ResponseEntity.ok(result);
    }

    // --- RESET PASSWORD BY EMAIL LINK ---
    @PostMapping("/forgot")
    public ResponseEntity<String> forgotPassword(@RequestBody OTPRequest request) throws CustomerException {
        String result = authenticationService.forgotPassword(request.getEmail());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/reset")
    public ResponseEntity<String> resetPassword(@RequestBody com.example.projectschedulehaircutserver.request.ResetPasswordRequest request) throws CustomerException {
        String result = authenticationService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(result);
    }
}
