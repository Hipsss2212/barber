package com.example.projectschedulehaircutserver.controller.manager;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.service.combo.ComboService;
import com.example.projectschedulehaircutserver.service.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class CreateServiceController {
    private final ProductService productService;
    private final ComboService comboService;

    @PostMapping("/create-service")
    public ResponseEntity<?> createService(@ModelAttribute ServiceDTO dto) throws IOException {
        productService.createService(dto);
        return ResponseEntity.ok("Thêm mới dịch vụ thành công");
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<?> updateService(
            @PathVariable Integer id,
            @ModelAttribute ServiceDTO dto) throws IOException {
        dto.setId(id);
        productService.updateService(dto);
        return ResponseEntity.ok("Cập nhật dịch vụ thành công");
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Integer id) {
        productService.deleteService(id);
        return ResponseEntity.ok("Xóa dịch vụ thành công");
    }

    @PostMapping("/create-combo")
    public ResponseEntity<?> createCombo(@ModelAttribute ComboDTO comboDTO) throws IOException {
        try {
            comboService.createCombo(comboDTO);
            return ResponseEntity.ok("Thêm mới combo thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/combos/{id}")
    public ResponseEntity<?> updateCombo(
            @PathVariable Integer id,
            @ModelAttribute ComboDTO comboDTO) throws IOException {
        try {
            comboDTO.setId(id);
            comboService.updateCombo(comboDTO);
            return ResponseEntity.ok("Cập nhật combo thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/combos/{id}")
    public ResponseEntity<?> deleteCombo(@PathVariable Integer id) {
        try {
            comboService.deleteCombo(id);
            return ResponseEntity.ok("Xóa combo thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
