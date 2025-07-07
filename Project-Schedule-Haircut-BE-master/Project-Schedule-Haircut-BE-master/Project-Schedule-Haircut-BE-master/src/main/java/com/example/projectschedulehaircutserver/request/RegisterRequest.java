package com.example.projectschedulehaircutserver.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String userName;
    private String email;
    private String fullName;
    private String password;
    private String phone;
    private String address;
    private Integer age;
}
