package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.dto.ServiceDTO;
import com.example.projectschedulehaircutserver.response.ServiceAndComboResponse;
import com.example.projectschedulehaircutserver.service.combo.ComboService;
import com.example.projectschedulehaircutserver.service.service.ProductService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class ShowServiceAndComboController {
    private final ProductService productService;
    private final ComboService comboService;

    @GetMapping("/service-combo/{categoryId}")
    public ResponseEntity<?> getServiceAndComboByCategoryId(@PathVariable("categoryId") Integer categoryId){
        Set<ServiceDTO> serviceDTOS = productService.findAllServiceByCategoryId(categoryId);
        Set<ComboDTO> comboDTOS = comboService.findAllComboByCategoryId(categoryId);
        return ResponseEntity.status(HttpStatus.OK).body(ServiceAndComboResponse.builder()
                .serviceDTOS(serviceDTOS)
                .comboDTOS(comboDTOS)
                .build());
    }

}
