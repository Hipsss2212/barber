package com.example.projectschedulehaircutserver.service.employee;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.request.TotalPriceByEmployeeAndDayRequest;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentByHourResponse;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentNeedsConfirmationResponse;
import com.example.projectschedulehaircutserver.response.EmployeeBookedStaffResponse;
import com.example.projectschedulehaircutserver.response.TotalPriceByEmployeeAndDayResponse;

import java.util.List;
import java.util.Set;

public interface EmployeeService {
    void createEmployee(EmployeeDTO employeeDTO);

    Set<EmployeeDTO> showAllEmployee();

    TotalPriceByEmployeeAndDayResponse totalPriceByEmployeeAndDay(TotalPriceByEmployeeAndDayRequest request) throws LoginException;

    EmployeeBookedStaffResponse getEmployeeBookingStats() throws LoginException;

    List<EmployeeAppointmentByHourResponse> getAppointmentsByHour() throws LoginException;

    List<EmployeeAppointmentNeedsConfirmationResponse> getAppointmentsNeedsConfirmation() throws LoginException;

    void updateEmployee(Integer id, EmployeeDTO employeeDTO);
}
