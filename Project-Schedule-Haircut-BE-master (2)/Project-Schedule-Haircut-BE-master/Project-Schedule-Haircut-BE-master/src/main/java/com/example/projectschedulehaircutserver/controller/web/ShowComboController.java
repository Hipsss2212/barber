package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.dto.ComboDTO;
import com.example.projectschedulehaircutserver.service.combo.ComboService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class ShowComboController {
    private ComboService comboService;

    @GetMapping("/findAllCombo")
    public ResponseEntity<?> findAllCombo(){
        try {
            Set<ComboDTO> comboDTOS = comboService.findAllCombo();
            return ResponseEntity.status(HttpStatus.OK).body(comboDTOS);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
