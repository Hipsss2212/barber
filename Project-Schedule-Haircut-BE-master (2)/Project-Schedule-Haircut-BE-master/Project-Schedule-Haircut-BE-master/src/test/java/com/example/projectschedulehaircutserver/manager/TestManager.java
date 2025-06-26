package com.example.projectschedulehaircutserver.manager;

import com.example.projectschedulehaircutserver.dto.ManagerDTO;
import com.example.projectschedulehaircutserver.service.manager.ManagerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class TestManager {
    @Autowired
    private ManagerService managerService;

//    @Test
//    void create(){
////         ManagerDTO managerDTO = new ManagerDTO("admin1", "12345", "nguyễn văn admin");
////        ManagerDTO managerDTO = new ManagerDTO("admin2", "12345", "nguyễn văn admin");
//        ManagerDTO managerDTO = new ManagerDTO("admin3", "12345", "nguyễn văn admin");
//         managerService.createManager(managerDTO, 210001);
//    }
}
