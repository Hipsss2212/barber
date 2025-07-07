package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Integer id;
    private String name;
    private String image;
    private BigDecimal price;
    private Integer haircutTime;
    private MultipartFile file;
    private Integer categoryId;

    public ServiceDTO(Integer id, String name, String image, BigDecimal price, Integer haircutTime) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.haircutTime = haircutTime;
    }

    public ServiceDTO(String name, BigDecimal price, Integer haircutTime, MultipartFile file, Integer categoryId) {
        this.name = name;
        this.price = price;
        this.haircutTime = haircutTime;
        this.file = file;
        this.categoryId = categoryId;
    }

    public ServiceDTO(Integer id, String name, BigDecimal price, Integer haircutTime, MultipartFile file, Integer categoryId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.haircutTime = haircutTime;
        this.file = file;
        this.categoryId = categoryId;
    }
}
