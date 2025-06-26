package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeAppointmentByHourResponse {
    private LocalTime time;
    private Long count;

    public EmployeeAppointmentByHourResponse(Integer hour, Long count) {
        this.time = LocalTime.of(hour, 0);
        this.count = count;
    }
}
