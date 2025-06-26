package com.example.projectschedulehaircutserver.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String email;
    private String code;
    private String newPassword;
}