package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
    private Integer id;
    private String userName;
    private String password;
    private String fullName;
    private String email;
    private String avatar;
    private Integer age;
    private String address;
    private String phone;
    private Integer accountId;
    private Byte isBlocked;

    public CustomerDTO(String userName, String password, String fullName, Integer age, String address, String phone) {
        this.userName = userName;
        this.password = password;
        this.fullName = fullName;
        this.age = age;
        this.address = address;
        this.phone = phone;
    }
}
