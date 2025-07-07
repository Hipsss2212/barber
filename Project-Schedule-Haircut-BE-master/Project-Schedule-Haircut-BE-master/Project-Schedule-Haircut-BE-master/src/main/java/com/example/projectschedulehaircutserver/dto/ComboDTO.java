package com.example.projectschedulehaircutserver.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComboDTO {
    private Integer id;
    private String name;
    private String image;
    private BigDecimal price;
    private Integer haircutTime;
    private MultipartFile file;
    private Integer categoryId;
    private Set<Integer> services;

    public ComboDTO(Integer id, String name, String image, BigDecimal price, Integer haircutTime) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.price = price;
        this.haircutTime = haircutTime;
    }

    public ComboDTO(String name, BigDecimal price, MultipartFile file, Integer categoryId, Set<Integer> services) {
        this.name = name;
        this.price = price;
        this.file = file;
        this.categoryId = categoryId;
        this.services = services;
    }

    public ComboDTO(Integer id, String name, BigDecimal price, MultipartFile file, Integer categoryId, Set<Integer> services) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.file = file;
        this.categoryId = categoryId;
        this.services = services;
    }
}
