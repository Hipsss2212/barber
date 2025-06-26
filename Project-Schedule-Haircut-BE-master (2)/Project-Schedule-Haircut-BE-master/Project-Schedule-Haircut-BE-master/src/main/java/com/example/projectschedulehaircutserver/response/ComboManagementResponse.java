package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboManagementResponse {
    private Integer id;
    private String name;
    private BigDecimal price;
    private String image;
    private Set<Integer> services;
}
