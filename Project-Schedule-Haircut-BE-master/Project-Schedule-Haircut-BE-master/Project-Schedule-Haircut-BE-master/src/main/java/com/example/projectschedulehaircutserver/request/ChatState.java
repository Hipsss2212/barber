package com.example.projectschedulehaircutserver.request;

import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.entity.Service;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatState {
    private int step = 0;
    private String serviceChosen;
    private String comboChosen;
    private String employeeChosen;
    private LocalDate orderDate;
    private LocalTime orderTime;
    private Set<Employee.EmployeeType> allowedEmployeeTypes;
    private List<Service> availableServices;
}
