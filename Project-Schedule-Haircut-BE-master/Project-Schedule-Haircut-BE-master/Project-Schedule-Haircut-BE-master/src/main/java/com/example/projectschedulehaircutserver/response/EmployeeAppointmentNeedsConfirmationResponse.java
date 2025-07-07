package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeAppointmentNeedsConfirmationResponse {
    private Integer id;
    private String time;
    private String date;
    private String customerName;
    private List<String> services;
    private Integer status;
}
