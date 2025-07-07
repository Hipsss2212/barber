package com.example.projectschedulehaircutserver.service.manager;

import com.example.projectschedulehaircutserver.dto.ManagerDTO;

public interface ManagerService {
    void createManager(ManagerDTO managerDTO, Integer roleId);
}
