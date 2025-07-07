package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceManagementResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private Integer haircutTime;
    private String image;
    private CategoryResponse category;
}
