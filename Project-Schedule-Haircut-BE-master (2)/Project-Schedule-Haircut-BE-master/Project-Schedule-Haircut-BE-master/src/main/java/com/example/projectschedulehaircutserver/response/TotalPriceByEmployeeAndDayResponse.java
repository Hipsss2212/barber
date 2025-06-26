package com.example.projectschedulehaircutserver.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TotalPriceByEmployeeAndDayResponse {
    private Integer totalOrder;
//    private Integer totalCustomerOrder;
    private BigDecimal totalSalary;

    public TotalPriceByEmployeeAndDayResponse(Object[] data) {
        this.totalOrder = (Integer) data[0];
        this.totalSalary = (BigDecimal) data[1];
    }
}
