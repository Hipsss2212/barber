package com.example.projectschedulehaircutserver.controller.customer;

import com.example.projectschedulehaircutserver.service.time.TimeService;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/customer/time")
@AllArgsConstructor
public class ShowAllTimeForEmployeeController {

    private final TimeService timeService;

    @GetMapping("/{employeeId}")
    public ResponseEntity<?> getTimeByEmployeeIdAndDate(
            @PathVariable("employeeId") Integer employeeId,
            @RequestParam("date") String dateString
    ) {
        try {
            // Chuyển đổi chuỗi "dd - MM - yyyy" sang LocalDate
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("dd - MM - yyyy");
            LocalDate parsedDate = LocalDate.parse(dateString, inputFormatter);

            // Chuyển đổi sang định dạng "yyyy-MM-dd" (nếu cần)
            DateTimeFormatter outputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            String formattedDate = parsedDate.format(outputFormatter);

            return ResponseEntity.ok(timeService.findTimeByEmployeeIdAndOrderDate(employeeId, parsedDate));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use 'dd - MM - yyyy'");
        }
    }
}
