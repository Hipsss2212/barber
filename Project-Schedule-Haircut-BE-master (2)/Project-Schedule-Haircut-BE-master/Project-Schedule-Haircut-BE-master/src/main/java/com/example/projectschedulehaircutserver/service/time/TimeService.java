package com.example.projectschedulehaircutserver.service.time;

import com.example.projectschedulehaircutserver.dto.TimeDTO;

import java.time.LocalDate;
import java.util.Set;

public interface TimeService {
    Set<TimeDTO> findTimeByEmployeeIdAndOrderDate(Integer employeeId, LocalDate orderDate);

    Set<TimeDTO> findAllTimes();

    void addTimeForEmployee(Integer timeId, Integer employeeId);

    void removeTimeFromEmployee(Integer timeId, Integer employeeId);
}
