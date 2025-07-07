package com.example.projectschedulehaircutserver.service.category;

import com.example.projectschedulehaircutserver.dto.CategoryDTO;
import com.example.projectschedulehaircutserver.repository.CategoryRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService{
    private final CategoryRepo categoryRepo;

    // lấy danh sách loại dịch vụ
    @Override
    public Set<CategoryDTO> getAllCategory() {
        return categoryRepo.findAllCategories();
    }
}
