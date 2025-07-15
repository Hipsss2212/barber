package com.example.projectschedulehaircutserver.controller.manager;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.exeption.CustomerException;
import com.example.projectschedulehaircutserver.service.account.AccountService;
import com.example.projectschedulehaircutserver.service.customer.CustomerService;
import com.example.projectschedulehaircutserver.service.employee.EmployeeService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor
public class AccountManagementController {
    private final AccountService accountService;
    private final EmployeeService employeeService;

    @GetMapping("/accounts")
    public ResponseEntity<?> getAccountManagement() throws CustomerException {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @PutMapping("/updated/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Integer id, @RequestBody EmployeeDTO employeeDTO) {
        employeeService.updateEmployee(id, employeeDTO);
        return ResponseEntity.ok("Cập nhật thành công");
    }

    @PutMapping("/change-block/{id}")
    public ResponseEntity<?> changeBlock(
            @PathVariable("id") Integer accountId,
            @RequestParam("isBlocked") Boolean isBlocked) {

        accountService.changeIsBlockedAccount(isBlocked, accountId);
        return ResponseEntity.ok("Cập nhật trạng thái khóa tài khoản thành công");
    }

}
