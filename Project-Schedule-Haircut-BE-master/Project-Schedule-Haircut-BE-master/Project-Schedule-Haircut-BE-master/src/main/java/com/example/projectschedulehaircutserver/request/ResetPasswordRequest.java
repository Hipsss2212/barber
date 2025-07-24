package com.example.projectschedulehaircutserver.request;

import lombok.Data;
 
@Data
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
} 