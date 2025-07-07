package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.dto.OrderDTO;
import com.example.projectschedulehaircutserver.request.AllOrderEmployeeAndDateRequest;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/web")
@AllArgsConstructor
public class ShowAllEmployeeController {
    private EmployeeService employeeService;

    @GetMapping("/findAllEmployee")
    public ResponseEntity<?> showALlEmployee(){
        try {
            Set<EmployeeDTO> employeeDTOS = employeeService.showAllEmployee();
            return ResponseEntity.status(HttpStatus.OK).body(employeeDTOS);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
