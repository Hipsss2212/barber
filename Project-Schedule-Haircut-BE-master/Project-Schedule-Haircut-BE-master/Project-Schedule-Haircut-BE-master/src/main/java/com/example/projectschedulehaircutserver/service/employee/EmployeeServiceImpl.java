package com.example.projectschedulehaircutserver.service.employee;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.entity.*;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.repository.EmployeeRepo;
import com.example.projectschedulehaircutserver.repository.RoleRepo;
import com.example.projectschedulehaircutserver.request.TotalPriceByEmployeeAndDayRequest;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentByHourResponse;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentNeedsConfirmationResponse;
import com.example.projectschedulehaircutserver.response.EmployeeBookedStaffResponse;
import com.example.projectschedulehaircutserver.response.TotalPriceByEmployeeAndDayResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService{
    private EmployeeRepo employeeRepo;
    private AccountRepo accountRepo;
    private RoleRepo roleRepo;
    private PasswordEncoder encoder;

    // tạo tài khoản nhân viên
    @Override
    @Transactional
    public void createEmployee(EmployeeDTO employeeDTO) {
        Role role = roleRepo.findById(1)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role-"));

        if (accountRepo.existsByUserName(employeeDTO.getUserName())) {
            throw new RuntimeException("Tên đăng nhập đã được sử dụng");
        }

        if (accountRepo.existsByEmail(employeeDTO.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        if (accountRepo.existsByPhone(employeeDTO.getPhone())) {
            throw new RuntimeException("Số điện thoại đã được sử dụng");
        }


        Employee employee = new Employee();
        employee.setFullName(employeeDTO.getFullName());
        employee.setUserName(employeeDTO.getUserName());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPassword(encoder.encode(employeeDTO.getPassword()));
        employee.setAge(employeeDTO.getAge());
        employee.setAddress(employeeDTO.getAddress());
        employee.setPhone(employeeDTO.getPhone());
        employee.setRole(role);
        employee.setIsBlocked(false);
        employee.setAvatar("https://i.postimg.cc/pVs3qTMy/image.png");
        employee.setEmployeeType(employeeDTO.getType() == 0
                ? Employee.EmployeeType.HAIR_STYLIST_STAFF
                : Employee.EmployeeType.SPA_STAFF);


        employeeRepo.save(employee);
    }

    // cập nhật thông tin nhân viên
    @Override
    @Transactional
    public void updateEmployee(Integer id, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepo.findByAccountId(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với id: " + id));

        if (!employee.getUsername().equals(employeeDTO.getUserName())) {
            if (accountRepo.existsByUserName(employeeDTO.getUserName())) {
                throw new RuntimeException("Tên đăng nhập đã được sử dụng");
            }
        }

        if (!employee.getEmail().equals(employeeDTO.getEmail())) {
            if (accountRepo.existsByEmail(employeeDTO.getEmail())) {
                throw new RuntimeException("Email đã được sử dụng");
            }
        }

        if (!employee.getPhone().equals(employeeDTO.getPhone())) {
            if (accountRepo.existsByPhone(employeeDTO.getPhone())) {
                throw new RuntimeException("Số điện thoại đã được sử dụng");
            }
        }

        employee.setAge(employeeDTO.getAge());
        employee.setEmail(employeeDTO.getEmail());
        employee.setPhone(employeeDTO.getPhone());
        employee.setAddress(employeeDTO.getAddress());
        employee.setFullName(employeeDTO.getFullName());

        employee.setEmployeeType(employeeDTO.getType() == 0
                ? Employee.EmployeeType.HAIR_STYLIST_STAFF
                : Employee.EmployeeType.SPA_STAFF);

        employeeRepo.save(employee);
    }

    @Override
    @Transactional
    public void updateEmployeeProfile(EmployeeDTO employeeDTO) {
        Employee employee = employeeRepo.findByEmployeeUsername(employeeDTO.getUserName())
            .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên"));
        if (employeeDTO.getFullName() != null) employee.setFullName(employeeDTO.getFullName());
        if (employeeDTO.getEmail() != null) employee.setEmail(employeeDTO.getEmail());
        if (employeeDTO.getPhone() != null) employee.setPhone(employeeDTO.getPhone());
        if (employeeDTO.getAddress() != null) employee.setAddress(employeeDTO.getAddress());
        if (employeeDTO.getAvatar() != null) employee.setAvatar(employeeDTO.getAvatar());
        if (employeeDTO.getAge() != null) employee.setAge(employeeDTO.getAge());
        // Có thể cập nhật thêm các trường khác nếu cần
        employeeRepo.save(employee);
    }

    // hiển thị danh sách nhân viên
    @Override
    public Set<EmployeeDTO> showAllEmployee() {
        return employeeRepo.findAllEmployee();
    }

    // tổng doanh thu theo nhân viên và ngày
    @Override
    public TotalPriceByEmployeeAndDayResponse totalPriceByEmployeeAndDay(TotalPriceByEmployeeAndDayRequest request) throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Employee employee = (Employee) authentication.getPrincipal();

                Object[] objects = employeeRepo.totalPriceByEmployeeAndDay(employee.getId(), request.getDays());

                return new TotalPriceByEmployeeAndDayResponse(objects);
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lấy thống kê các lịch hẹn
    @Override
    public EmployeeBookedStaffResponse getEmployeeBookingStats() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Employee employee = (Employee) authentication.getPrincipal();

                return employeeRepo.getEmployeeBookingStats(employee.getId());
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lấy danh sách lịch hẹn theo giờ
    @Override
    public List<EmployeeAppointmentByHourResponse> getAppointmentsByHour() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Employee employee = (Employee) authentication.getPrincipal();

                return employeeRepo.getAppointmentsByHour(employee.getId());
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lấy danh sách lịch hẹn cần xác nhận và đã xác nhận (sắp tới)
    @Override
    public List<EmployeeAppointmentNeedsConfirmationResponse> getAppointmentsNeedsConfirmation() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Employee employee = (Employee) authentication.getPrincipal();

                List<Object[]> rawData = employeeRepo.getRawAppointmentsData(employee.getId());

                Map<Integer, EmployeeAppointmentNeedsConfirmationResponse> resultMap = new LinkedHashMap<>();

                DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
                LocalDateTime now = LocalDateTime.now();

                for (Object[] row : rawData) {
                    Orders order = (Orders) row[0];
                    String customerName = (String) row[1];
                    String serviceName = (String) row[2];

                    Integer orderId = order.getId();

                    // Chỉ lấy lịch status = 0 hoặc status = 1 (chưa hoàn thành/thanh toán), và còn trong tương lai
                    boolean isUpcoming = false;
                    if (order.getStatus() == 0 || order.getStatus() == 1) {
                        LocalDateTime bookingDateTime = LocalDateTime.of(order.getOrderDate(), order.getOrderStartTime());
                        if (bookingDateTime.isAfter(now)) {
                            isUpcoming = true;
                        }
                    }
                    if (!isUpcoming) continue;

                    resultMap.computeIfAbsent(orderId, id ->
                            new EmployeeAppointmentNeedsConfirmationResponse(
                                    orderId,
                                    formatTime(order.getOrderStartTime(), order.getOrderEndTime()),
                                    order.getOrderDate().format(dateFormatter),
                                    customerName,
                                    new ArrayList<>(),
                                    order.getStatus()
                            )
                    );

                    resultMap.get(orderId).getServices().add(serviceName);
                }

                return new ArrayList<>(resultMap.values());
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    @Override
    public Employee findByUsername(String username) {
        return employeeRepo.findByEmployeeUsername(username).orElse(null);
    }

    private String formatTime(LocalTime start, LocalTime end) {
        return start.toString() + " - " + end.toString();
    }
}
