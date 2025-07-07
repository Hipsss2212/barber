package com.example.projectschedulehaircutserver.service.combo;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.entity.Category;
import com.example.projectschedulehaircutserver.entity.Combo;
import com.example.projectschedulehaircutserver.repository.CategoryRepo;
import com.example.projectschedulehaircutserver.repository.ComboRepo;
import com.example.projectschedulehaircutserver.repository.ServiceRepo;
import com.example.projectschedulehaircutserver.response.ComboManagementResponse;
import com.example.projectschedulehaircutserver.service.uploadimage.ImageUploadService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ComboServiceImpl implements ComboService {
    private final ComboRepo comboRepo;
    private final ServiceRepo serviceRepo;
    private final ImageUploadService imageUploadService;
    private final CategoryRepo categoryRepo;

    // danh sách các combo
    @Override
    public Set<ComboDTO> findAllCombo() {
        return comboRepo.findAllCombo();
    }

    // danh sách combo từ loại dịch vụ
    @Override
    public Set<ComboDTO> findAllComboByCategoryId(Integer categoryId) {
        return comboRepo.findAllComboByCategoryId(categoryId).stream()
                .sorted(Comparator.comparing(ComboDTO::getId))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // danh sách combo dành cho management
    @Override
    public Set<ComboManagementResponse> getAllCombos() {
        try {
            List<Combo> combos = comboRepo.getAllCombos();
            if (combos.isEmpty()) {
                throw new NoSuchElementException("Danh sách combo trống");
            }

            Set<ComboManagementResponse> result = combos.stream()
                    .map(c -> new ComboManagementResponse(
                            c.getId(),
                            c.getName(),
                            c.getPrice(),
                            c.getImage(),
                            c.getServices().stream().map(service -> service.getId()).collect(Collectors.toSet())
                    ))
                    .collect(Collectors.toSet());

            return result;
        } catch (RuntimeException ex) {
            throw new RuntimeException("Lỗi truy vấn dữ liệu", ex);
        }
    }

    // tạo mới combo
    @Override
    @Transactional
    public void createCombo(ComboDTO comboDTO) {
        try {
            // Kiểm tra tên combo đã tồn tại chưa
            if (comboRepo.existsByName(comboDTO.getName())) {
                throw new IllegalArgumentException("Tên combo đã tồn tại");
            }

            Set<com.example.projectschedulehaircutserver.entity.Service> services = comboDTO.getServices().stream()
                    .map(serviceId -> serviceRepo.findById(serviceId)
                            .orElseThrow(() -> new NoSuchElementException("Không tìm thấy dịch vụ với ID: " + serviceId)))
                    .collect(Collectors.toSet());

            Integer totalHaircutTime = services.stream().mapToInt(com.example.projectschedulehaircutserver.entity.Service::getHaircutTime).sum();

            String imageUrl = null;
            if (comboDTO.getFile() != null && !comboDTO.getFile().isEmpty()) {
                imageUrl = imageUploadService.uploadImage(comboDTO.getFile());
            }

            Category category = categoryRepo.findById(Long.valueOf(comboDTO.getCategoryId())).orElseThrow();

            Combo newCombo = Combo.builder()
                    .name(comboDTO.getName())
                    .price(comboDTO.getPrice())
                    .haircutTime(totalHaircutTime)
                    .image(imageUrl)
                    .services(services)
                    .category(category)
                    .build();


            // Lưu vào database
            comboRepo.saveAndFlush(newCombo);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo combo: " + e.getMessage(), e);
        }
    }

    // cập nhật combo
    @Override
    public void updateCombo(ComboDTO comboDTO) throws IOException {
        try {
            Combo existingCombo = comboRepo.findById(comboDTO.getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy combo với ID: " + comboDTO.getId()));

            // Kiểm tra tên combo
            if (!existingCombo.getName().equals(comboDTO.getName()) &&
                    comboRepo.existsByName(comboDTO.getName())) {
                throw new IllegalArgumentException("Tên combo '" + comboDTO.getName() + "' đã tồn tại");
            }

            // Lấy danh sách dịch vụ
            Set<com.example.projectschedulehaircutserver.entity.Service> services = comboDTO.getServices().stream()
                    .map(serviceId -> serviceRepo.findById(serviceId)
                            .orElseThrow(() -> new NoSuchElementException("Không tìm thấy dịch vụ với ID: " + serviceId)))
                    .collect(Collectors.toSet());

            // Tính tổng thời gian từ các dịch vụ
            Integer totalHaircutTime = services.stream()
                    .mapToInt(com.example.projectschedulehaircutserver.entity.Service::getHaircutTime)
                    .sum();

            // Xử lý upload ảnh nếu có file mới
            String imageUrl = existingCombo.getImage();
            if (comboDTO.getFile() != null && !comboDTO.getFile().isEmpty()) {
                // Xóa ảnh cũ nếu có
                if (imageUrl != null) {
                    imageUploadService.deleteImage(imageUrl);
                }
                imageUrl = imageUploadService.uploadImage(comboDTO.getFile());
            }

            // Lấy danh mục
            Category category = comboDTO.getCategoryId() != null ?
                    categoryRepo.findById(Long.valueOf(comboDTO.getCategoryId()))
                            .orElseThrow(() -> new NoSuchElementException("Không tìm thấy danh mục với ID: " + comboDTO.getCategoryId())) :
                    existingCombo.getCategory();

            // Cập nhật thông tin combo
            existingCombo.setName(comboDTO.getName());
            existingCombo.setPrice(comboDTO.getPrice());
            existingCombo.setHaircutTime(totalHaircutTime);
            existingCombo.setImage(imageUrl);
            existingCombo.setServices(services);
            existingCombo.setCategory(category);

            // Lưu thay đổi
            comboRepo.save(existingCombo);
        } catch (RuntimeException e) {
            throw new RuntimeException("Lỗi khi cập nhật combo: " + e.getMessage(), e);
        }
    }

    // xoá combo
    @Override
    public void deleteCombo (Integer comboId){
        if (!comboRepo.existsById(comboId)) {
            throw new NoSuchElementException("Không tìm thấy dịch vụ với ID: " + comboId);
        }

        comboRepo.deleteById(comboId);
    }

}
