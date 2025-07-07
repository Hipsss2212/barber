package com.example.projectschedulehaircutserver.customer;

import com.example.projectschedulehaircutserver.dto.CustomerDTO;
import com.example.projectschedulehaircutserver.service.customer.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestCustomer {
    @Autowired
    private CustomerService customerService;

//    @Test
//    void create(){
//        CustomerDTO customerDTO = new CustomerDTO("hieu31", "12345", "nguyễn văn hiếu", 30, "Vĩnh Điện, Quảng Ngãi", "0327455555");
////        CustomerDTO customerDTO = new CustomerDTO("minh2602", "12345", "nguyễn văn minh", 30, "Vĩnh Điện, Quảng Nam", "0927455999");
////        CustomerDTO customerDTO = new CustomerDTO("vanan", "12345", "nguyễn văn an", 20, "Tiên Phước, Quảng Nam", "0875789999");
//        customerService.createCustomer(customerDTO);
//    }
}
