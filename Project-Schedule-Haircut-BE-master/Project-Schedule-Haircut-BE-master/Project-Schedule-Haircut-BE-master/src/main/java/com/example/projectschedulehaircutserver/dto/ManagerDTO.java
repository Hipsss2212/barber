package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManagerDTO {
    private Integer id;
    private String useName;
    private String password;
    private String fullName;

    public ManagerDTO(String useName, String password, String fullName) {
        this.useName = useName;
        this.password = password;
        this.fullName = fullName;
    }
}
