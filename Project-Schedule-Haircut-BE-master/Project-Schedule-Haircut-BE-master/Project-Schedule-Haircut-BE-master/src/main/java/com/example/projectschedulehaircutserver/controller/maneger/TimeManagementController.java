package com.example.projectschedulehaircutserver.controller.maneger;

import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.request.TimeEmployeeRequest;
import com.example.projectschedulehaircutserver.service.time.TimeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class TimeManagementController {
    private final TimeService timeService;

    @GetMapping("/times")
    public ResponseEntity<?> getAllTimes() {
        return ResponseEntity.ok(timeService.findAllTimes());
    }

    @PostMapping("/addTime")
    public ResponseEntity<?> addTimeToEmployee(
            @RequestBody TimeEmployeeRequest request) {
        timeService.addTimeForEmployee(request.getTimeId(), request.getEmployeeId());
        return ResponseEntity.ok("Thành công");
    }

    @DeleteMapping("/removeTime")
    public ResponseEntity<?> removeTimeFromEmployee(
            @RequestBody TimeEmployeeRequest request) {
        timeService.removeTimeFromEmployee(request.getTimeId(), request.getEmployeeId());
        return ResponseEntity.ok("Thành công");
    }
}
