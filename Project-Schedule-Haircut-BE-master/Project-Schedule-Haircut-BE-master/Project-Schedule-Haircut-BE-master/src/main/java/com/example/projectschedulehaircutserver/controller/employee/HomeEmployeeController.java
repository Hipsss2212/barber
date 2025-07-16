package com.example.projectschedulehaircutserver.controller.employee;

import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentByHourResponse;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentNeedsConfirmationResponse;
import com.example.projectschedulehaircutserver.response.EmployeeBookedStaffResponse;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projectschedulehaircutserver.entity.Employee;
import java.util.List;
import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/employee")
@AllArgsConstructor
public class HomeEmployeeController {
    private final EmployeeService employeeService;

    // Lấy thống kê booking
    @GetMapping("/booking-stats")
    public ResponseEntity<?> getBookingStats() {
        try {
            EmployeeBookedStaffResponse response = employeeService.getEmployeeBookingStats();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (LoginException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    // Lấy lịch hẹn theo giờ
    @GetMapping("/appointments-by-hour")
    public ResponseEntity<?> getAppointmentsByHour() {
        try {
            List<EmployeeAppointmentByHourResponse> response = employeeService.getAppointmentsByHour();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (LoginException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    // Lấy danh sách cần xác nhận
    @GetMapping("/appointments-confirmation")
    public ResponseEntity<?> getAppointmentsNeedsConfirmation() {
        try {
            List<EmployeeAppointmentNeedsConfirmationResponse> response = employeeService.getAppointmentsNeedsConfirmation();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (LoginException e) {
            return new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        }
    }

    // Lấy thông tin cá nhân nhân viên
    @GetMapping("/info")
    public ResponseEntity<?> getEmployeeInfo(@RequestParam String username) {
        Employee employee = employeeService.findByUsername(username);
        if (employee == null) {
            return new ResponseEntity<>("Không tìm thấy nhân viên", HttpStatus.NOT_FOUND);
        }
        EmployeeDTO dto = EmployeeDTO.builder()
            .id(employee.getId())
            .userName(employee.getUsername())
            .fullName(employee.getFullName())
            .email(employee.getEmail())
            .phone(employee.getPhone())
            .address(employee.getAddress())
            .avatar(employee.getAvatar())
            .age(employee.getAge())
            .type(employee.getEmployeeType() != null && employee.getEmployeeType().name().equals("HAIR_STYLIST_STAFF") ? 0 : 1)
            .isBlocked(employee.getIsBlocked() != null && employee.getIsBlocked() ? 1 : 0)
            .build();
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateEmployeeProfile(@RequestBody EmployeeDTO employeeDTO) {
        try {
            employeeService.updateEmployeeProfile(employeeDTO);
            return ResponseEntity.ok("Cập nhật thông tin thành công");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}