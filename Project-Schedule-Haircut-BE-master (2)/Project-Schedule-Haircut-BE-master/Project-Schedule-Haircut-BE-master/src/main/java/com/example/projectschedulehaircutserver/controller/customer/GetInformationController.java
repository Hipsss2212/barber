package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.dto.CustomerDTO;
import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.service.customer.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
public class GetInformationController {
    private final CustomerService customerService;

    @GetMapping("/info")
    public ResponseEntity<?> getCustomerInfo(@RequestParam String username) throws CustomerException {
        try {
            CustomerDTO customerInfo = customerService.getInformationCustomer(username);
            return ResponseEntity.ok(customerInfo);
        } catch (CustomerException ex) {
            throw ex;
        }
    }
}
