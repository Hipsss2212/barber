package com.example.projectschedulehaircutserver.service.authentication;

import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.exeption.RefreshTokenException;
import com.example.projectschedulehaircutserver.exeption.RegisterException;
import com.example.projectschedulehaircutserver.request.LoginRequest;
import com.example.projectschedulehaircutserver.request.RefreshTokenRequest;
import com.example.projectschedulehaircutserver.request.RegisterRequest;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;

public interface AuthenticationService {
    String registerUser(RegisterRequest request) throws RegisterException;

    AuthenticationResponse authenticate(LoginRequest request) ;

    AuthenticationResponse refreshToken(RefreshTokenRequest request) throws RefreshTokenException;

    String requestChangePassword(String email) throws CustomerException;

    String changePassword(String email, String code, String newPassword) throws CustomerException;

    String verifyEmail(String token);

    String resendVerificationCode(String email);

    // --- RESET PASSWORD BY EMAIL LINK ---
    String forgotPassword(String email) throws CustomerException;
    String resetPassword(String token, String newPassword) throws CustomerException;
}
