package com.example.projectschedulehaircutserver.dto;

import com.example.projectschedulehaircutserver.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Long id;
    private String name;
    private Category.CategoryType type;
    private String image;
}
