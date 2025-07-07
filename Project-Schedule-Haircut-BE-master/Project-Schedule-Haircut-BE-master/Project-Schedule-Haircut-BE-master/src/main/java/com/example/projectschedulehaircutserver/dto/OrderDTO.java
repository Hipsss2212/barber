package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer id;
    private Date orderDate;
    private Time orderStartTime;
    private Time orderEndTime;
    private List<String> employeeName;
    private List<String> serviceName;
    private BigDecimal totalPrice;
    private Integer status;



}
