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
public class ShowAllServiceByComboIdResponse {
    private Integer c_id;
    private String c_name;
    private BigDecimal c_price;
    private Integer c_haircutTime;
    private Integer s_id;
    private String s_name;
    private BigDecimal s_price;
    private Integer s_haircutTime;

    public ShowAllServiceByComboIdResponse(Object[] columns) {
        this.c_id = (Integer) columns[0];
        this.c_name = (String) columns[1];
        this.c_price = (BigDecimal) columns[2];
        this.c_haircutTime = (Integer) columns[3];
        this.s_id = (Integer) columns[4];
        this.s_name = (String) columns[5];
        this.s_price = (BigDecimal) columns[6];
        this.s_haircutTime = (Integer) columns[7];
    }
}
