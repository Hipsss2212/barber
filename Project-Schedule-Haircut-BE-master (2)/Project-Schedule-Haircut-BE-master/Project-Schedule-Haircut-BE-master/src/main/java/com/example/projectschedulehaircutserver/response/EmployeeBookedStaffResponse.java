package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeBookedStaffResponse {
    private String totalBooked;
    private String doneBooked;
    private String upcomingBooked;
    private String cancelledBooked;
}
