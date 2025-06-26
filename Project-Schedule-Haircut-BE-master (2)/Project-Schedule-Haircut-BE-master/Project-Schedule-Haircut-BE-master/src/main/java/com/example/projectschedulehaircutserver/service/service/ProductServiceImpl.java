package com.example.projectschedulehaircutserver.service.service;

import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.entity.Category;
import com.example.projectschedulehaircutserver.repository.CategoryRepo;
import com.example.projectschedulehaircutserver.repository.ServiceRepo;
import com.example.projectschedulehaircutserver.response.ServiceManagementResponse;
import com.example.projectschedulehaircutserver.response.ShowAllServiceByComboIdResponse;
import com.example.projectschedulehaircutserver.service.uploadimage.ImageUploadService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final ServiceRepo serviceRepo;
    private final ImageUploadService imageUploadService;
    private final CategoryRepo categoryRepo;

    // lấy danh sách dịch vụ
    @Override
    public Set<ServiceDTO> findAllService() {
        return serviceRepo.findAllService();
    }

    // lấy danh sách dịch vụ từ combo
    @Override
    @Transactional
    public Set<ShowAllServiceByComboIdResponse> findAllServiceByComboId(Integer id) {
        List<Object[]> objects = serviceRepo.findAllServiceByComboId(id);

        return objects.stream()
                .map(ShowAllServiceByComboIdResponse::new)
                .collect(Collectors.toSet());
    }

    // lấy danh sách dịch vụ từ loại dịch vụ
    @Override
    public Set<ServiceDTO> findAllServiceByCategoryId(Integer categoryId) {
        return serviceRepo.findAllServiceByCategoryId(categoryId).stream()
                .sorted(Comparator.comparing(ServiceDTO::getId))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    // lấy danh sách dịch vụ dành cho management
    @Override
    public Set<ServiceManagementResponse> getAllServices() {
        try {
            Set<ServiceManagementResponse> result = serviceRepo.getAllServices();
            if(result.isEmpty()) {
                throw new NoSuchElementException("Danh sách khách hàng trống");
            }
            return result;
        } catch (RuntimeException ex) {
            throw new RuntimeException("Lỗi truy vấn dữ liệu");
        }
    }

    // tạo mới dịch vụ
    @Override
    @Transactional
    public void createService(ServiceDTO serviceDTO) throws IOException {
        // 1. Upload ảnh lên Cloudinary
        String imageUrl = imageUploadService.uploadImage(serviceDTO.getFile());

        Category category = categoryRepo.findById(Long.valueOf(serviceDTO.getCategoryId())).orElseThrow();

        com.example.projectschedulehaircutserver.entity.Service service = new com.example.projectschedulehaircutserver.entity.Service();
        service.setName(serviceDTO.getName());
        service.setPrice(serviceDTO.getPrice());
        service.setHaircutTime(serviceDTO.getHaircutTime());
        service.setImage(imageUrl);
        service.setCategory(category);

        serviceRepo.save(service);
    }

    // cập nhật dịch vụ
    @Override
    @Transactional
    public void updateService(ServiceDTO serviceDTO) throws IOException {
        // 1. Tìm service cần cập nhật
        com.example.projectschedulehaircutserver.entity.Service existingService = serviceRepo.findById(serviceDTO.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy dịch vụ với ID: " + serviceDTO.getId()));

        // 2. Nếu có file ảnh mới thì upload ảnh mới
        String imageUrl = existingService.getImage();
        if (serviceDTO.getFile() != null && !serviceDTO.getFile().isEmpty()) {
            imageUrl = imageUploadService.uploadImage(serviceDTO.getFile());
        }

        // 3. Tìm category nếu có thay đổi
        Category category = existingService.getCategory();
        if (serviceDTO.getCategoryId() != null &&
                !serviceDTO.getCategoryId().equals(existingService.getCategory().getId().intValue())) {
            category = categoryRepo.findById(Long.valueOf(serviceDTO.getCategoryId()))
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy danh mục với ID: " + serviceDTO.getCategoryId()));
        }

        // 4. Cập nhật thông tin
        existingService.setName(serviceDTO.getName());
        existingService.setPrice(serviceDTO.getPrice());
        existingService.setHaircutTime(serviceDTO.getHaircutTime());
        existingService.setImage(imageUrl);
        existingService.setCategory(category);

        // 5. Lưu vào database
        serviceRepo.save(existingService);
    }

    // xóa dịch vụ
    @Override
    @Transactional
    public void deleteService(Integer serviceId) {
        if (!serviceRepo.existsById(serviceId)) {
            throw new NoSuchElementException("Không tìm thấy dịch vụ với ID: " + serviceId);
        }

        // 2. Kiểm tra ràng buộc (nếu service đang được sử dụng trong combo thì không xóa)
        boolean isUsedInCombo = serviceRepo.isServiceUsedInAnyCombo(serviceId);
        if (isUsedInCombo) {
            throw new IllegalStateException("Không thể xóa dịch vụ vì đang được sử dụng trong combo");
        }

        serviceRepo.deleteById(serviceId);
    }

}
