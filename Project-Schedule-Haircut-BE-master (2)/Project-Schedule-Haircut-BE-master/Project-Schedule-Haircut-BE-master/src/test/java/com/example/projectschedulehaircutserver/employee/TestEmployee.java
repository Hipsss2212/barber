package com.example.projectschedulehaircutserver.employee;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestEmployee {
    @Autowired
    private EmployeeService employeeService;

//    @Test
//    void create(){
////        EmployeeDTO employeeDTO = new EmployeeDTO("tuanvy14042k3", "12345", "Nguyễn Viên Tuấn Vỹ",21, "Điện Bàn, Quảng Name", "0327443333", "https://i.postimg.cc/TPrghjZX/image.png", "tuanvy@gmail.com", 0);
////        EmployeeDTO employeeDTO = new EmployeeDTO("vuong", "12345", "Nguyễn Thị Hồng Vương",21, "Trà My, Quảng Name", "0324562333", "https://i.postimg.cc/ZKVT9QtQ/image.png", "hongvuong@gmail.com", 1);
////        EmployeeDTO employeeDTO = new EmployeeDTO("phapngu", "12345", "Nguyễn Văn Pháp",21, "Điện Bàn, Quảng Name", "0905045678", "https://i.postimg.cc/X7CJVjRR/image.png", "phap@gmail.com", 0);
////        EmployeeDTO employeeDTO = new EmployeeDTO("hieungu", "12345", "Nguyễn Văn Hiếu",21, "Điện Bàn, Quảng Nam", "0905041231", "https://i.postimg.cc/HkbzcwLb/image.png", "hieu@gmail.com", 0);
//        EmployeeDTO employeeDTO = new EmployeeDTO("anhbeo", "12345", "Lê Minh Ánh",21, "Điện Bàn, Quảng Nam", "0976565777", "https://i.postimg.cc/HkbzcwLb/image.png", "anhbeo@gmail.com", 0);
//        employeeService.createEmployee(employeeDTO);
//    }
}
