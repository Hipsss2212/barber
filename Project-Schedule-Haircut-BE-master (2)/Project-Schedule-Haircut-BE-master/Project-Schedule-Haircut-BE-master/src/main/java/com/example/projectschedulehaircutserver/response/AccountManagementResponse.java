package com.example.projectschedulehaircutserver.response;

import com.example.projectschedulehaircutserver.dto.AccountDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountManagementResponse {
    private Long id;
    private String type;
    private AccountDTO account;
    private String role;
    private Boolean isBlocked;
    private List<String> times;
    private Integer bookingCount;
}
