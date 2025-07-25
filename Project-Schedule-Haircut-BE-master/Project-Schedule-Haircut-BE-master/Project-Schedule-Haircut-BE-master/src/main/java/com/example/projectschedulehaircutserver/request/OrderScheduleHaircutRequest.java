package com.example.projectschedulehaircutserver.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderScheduleHaircutRequest {
    private LocalDate orderDate;
    private LocalTime orderStartTime;
    private BigDecimal totalPrice;
    private Integer haircutTime;
    private Integer comboId;
    private Set<Integer> serviceId;
    private Set<Integer> employeeId;
    private String couponCode;
    private Float couponDiscount;
}
