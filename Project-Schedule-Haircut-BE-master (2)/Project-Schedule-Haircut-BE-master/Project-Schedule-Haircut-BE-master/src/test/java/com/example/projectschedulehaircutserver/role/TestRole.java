package com.example.projectschedulehaircutserver.role;

import com.example.projectschedulehaircutserver.dto.RoleDTO;
import com.example.projectschedulehaircutserver.service.role.RoleService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestRole {
    @Autowired
    private RoleService roleService;

//    @Test
//    void create(){
//        RoleDTO roleDTO = new RoleDTO();
////        roleDTO.setName("EMPLOYEE");
//        roleDTO.setName("USER");
////        roleDTO.setName("ADMIN");
//        roleService.createRole(roleDTO);
//    }
}
