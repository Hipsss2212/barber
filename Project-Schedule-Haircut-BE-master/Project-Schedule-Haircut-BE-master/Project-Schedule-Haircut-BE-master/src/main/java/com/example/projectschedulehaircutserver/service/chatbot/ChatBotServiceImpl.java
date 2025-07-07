package com.example.projectschedulehaircutserver.service.chatbot;

import com.example.projectschedulehaircutserver.entity.Category;
import com.example.projectschedulehaircutserver.entity.Combo;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.repository.ComboRepo;
import com.example.projectschedulehaircutserver.repository.EmployeeRepo;
import com.example.projectschedulehaircutserver.repository.ServiceRepo;
import com.example.projectschedulehaircutserver.request.ChatState;
import com.example.projectschedulehaircutserver.request.OrderScheduleHaircutRequest;
import com.example.projectschedulehaircutserver.service.order.OrderService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ChatBotServiceImpl implements ChatBotService {
    private final ServiceRepo serviceRepository;
    private final ComboRepo comboRepository;
    private final EmployeeRepo employeeRepository;
    private final OrderService orderService;
    private final Map<Integer, ChatState> userStates = new HashMap<>();

    @Override
    public String processMessage(String message) throws LoginException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof AnonymousAuthenticationToken) {
            throw new LoginException("Bạn chưa đăng nhập");
        }

        Customer customer = (Customer) auth.getPrincipal();
        ChatState state = userStates.computeIfAbsent(customer.getId(), id -> new ChatState());

        try {
            switch (state.getStep()) {
                case 0:
                    return handleServiceSelection(state, customer);
                case 1:
                    return handleComboSelection(state, customer, message);
                case 2:
                    return handleEmployeeSelection(state, customer, message);
                case 3:
                    return handleDateSelection(state, customer, message);
                case 4:
                    return handleTimeSelection(state, customer, message);
                default:
                    return "Xin lỗi, tôi không hiểu. Hãy gõ 'đặt lịch' để bắt đầu.";
            }
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        } catch (Exception e) {
            return "Đã xảy ra lỗi: " + e.getMessage();
        }
    }

//    private String handleServiceSelection(ChatState state, Customer customer) {
//        List<com.example.projectschedulehaircutserver.entity.Service> services = serviceRepository.findAllServices();
//        if (services.isEmpty()) {
//            return "Hiện chưa có dịch vụ nào.";
//        }
//        String serviceNames = services.stream().map(com.example.projectschedulehaircutserver.entity.Service::getName)
//                .collect(Collectors.joining(", "));
//        state.setStep(1);
//        return "Bạn muốn chọn dịch vụ nào? Hiện có: " + serviceNames;
//    }
    private String handleServiceSelection(ChatState state, Customer customer) {
        List<com.example.projectschedulehaircutserver.entity.Service> services = serviceRepository.findAllServices();
        if (services.isEmpty()) {
            return "Hiện chưa có dịch vụ nào.";
        }

        state.setAvailableServices(services);

        StringBuilder response = new StringBuilder("Danh sách dịch vụ: <br>");
        for (int i = 0; i < services.size(); i++) {
            com.example.projectschedulehaircutserver.entity.Service service = services.get(i);
            response.append(i + 1)
                    .append(". ")
                    .append(service.getName())
                    .append(" - Giá: ")
                    .append(service.getPrice())
                    .append(" VND")
                    .append("<br><br>");
        }
        response.append("👉 Vui lòng nhập <b>số thứ tự</b> dịch vụ bạn chọn.");

        state.setStep(1);
        return response.toString();
    }


    private String handleComboSelection(ChatState state, Customer customer, String message) {
        List<com.example.projectschedulehaircutserver.entity.Service> services = state.getAvailableServices();

        Optional<com.example.projectschedulehaircutserver.entity.Service> serviceOpt = serviceRepository.findByName(message);
        if (serviceOpt.isEmpty()) {
            throw new IllegalArgumentException("Dịch vụ không tồn tại. Vui lòng nhập lại.");
        }

        state.setServiceChosen(message);
        List<Combo> combos = comboRepository.findAllCombos();
        if (combos.isEmpty()) {
            return "Hiện chưa có combo nào.";
        }
        String comboNames = combos.stream().map(Combo::getName).collect(Collectors.joining(", "));
        state.setStep(2);
        return "Bạn muốn chọn combo nào? Hiện có: " + comboNames;
    }

    private String handleEmployeeSelection(ChatState state, Customer customer, String message) {
        Optional<Combo> comboOpt = comboRepository.findComboByName(message);
        Optional<com.example.projectschedulehaircutserver.entity.Service> serviceOpt = serviceRepository.findByName(state.getServiceChosen());

        if (comboOpt.isEmpty()) {
            throw new IllegalArgumentException("Combo không tồn tại. Vui lòng nhập lại.");
        }

        state.setComboChosen(message);

        Category.CategoryType serviceType = serviceOpt.get().getCategory().getType();
        Category.CategoryType comboType = comboOpt.get().getCategory().getType();

        Set<Employee.EmployeeType> allowedEmployeeTypes = determineAllowedEmployeeTypes(serviceType, comboType);
        state.setAllowedEmployeeTypes(allowedEmployeeTypes);

        List<Employee> employees = employeeRepository.getAllEmployees().stream()
                .filter(e -> allowedEmployeeTypes.contains(e.getEmployeeType()))
                .toList();

        if (employees.isEmpty()) {
            return "Hiện không có nhân viên phù hợp với dịch vụ này.";
        }

        String employeeNames = employees.stream().map(Employee::getFullName).collect(Collectors.joining(", "));
        state.setStep(3);
        return "Bạn muốn chọn nhân viên nào? Hiện có: " + employeeNames;
    }

    private String handleDateSelection(ChatState state, Customer customer, String message) {
        try {
            LocalDate date = LocalDate.parse(message);
            state.setOrderDate(date);
            state.setStep(4);
            return "Vui lòng nhập giờ cắt (HH:mm):";
        } catch (Exception e) {
            throw new IllegalArgumentException("Ngày không hợp lệ, vui lòng nhập lại theo định dạng yyyy-MM-dd:");
        }
    }

    private String handleTimeSelection(ChatState state, Customer customer, String message) {
        try {
            LocalTime time = LocalTime.parse(message);
            state.setOrderTime(time);

            Optional<com.example.projectschedulehaircutserver.entity.Service> serviceOpt = serviceRepository.findByName(state.getServiceChosen());
            Optional<Combo> comboOpt = comboRepository.findComboByName(state.getComboChosen());
            Optional<Employee> employeeOpt = employeeRepository.findEmployeeByName(state.getEmployeeChosen());

            if (serviceOpt.isEmpty() || comboOpt.isEmpty() || employeeOpt.isEmpty()) {
                throw new IllegalArgumentException("Dữ liệu không hợp lệ. Vui lòng bắt đầu lại.");
            }

            OrderScheduleHaircutRequest request = OrderScheduleHaircutRequest.builder()
                    .orderDate(state.getOrderDate())
                    .orderStartTime(state.getOrderTime())
                    .comboId(comboOpt.get().getId())
                    .serviceId(Set.of(serviceOpt.get().getId()))
                    .employeeId(Set.of(employeeOpt.get().getId()))
                    .build();

            String response = orderService.bookingScheduleHaircut(request);
            userStates.remove(customer.getId());
            return response;
        } catch (Exception e) {
            throw new IllegalArgumentException("Giờ không hợp lệ, vui lòng nhập lại theo định dạng HH:mm:");
        }
    }

    private Set<Employee.EmployeeType> determineAllowedEmployeeTypes(Category.CategoryType serviceType, Category.CategoryType comboType) {
        Set<Employee.EmployeeType> allowedTypes = new HashSet<>();
        if (serviceType == Category.CategoryType.HAIRCUT || comboType == Category.CategoryType.HAIRCUT) {
            allowedTypes.add(Employee.EmployeeType.HAIR_STYLIST_STAFF);
        }
        if (serviceType == Category.CategoryType.SPA || comboType == Category.CategoryType.SPA) {
            allowedTypes.add(Employee.EmployeeType.SPA_STAFF);
        }
        return allowedTypes;
    }
}
