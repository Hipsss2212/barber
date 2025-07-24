package com.example.projectschedulehaircutserver.service.order;

import com.example.projectschedulehaircutserver.dto.OrderDTO;
import com.example.projectschedulehaircutserver.entity.*;
import com.example.projectschedulehaircutserver.exeption.LoginException;
import com.example.projectschedulehaircutserver.exeption.OrderException;
import com.example.projectschedulehaircutserver.repository.*;
import com.example.projectschedulehaircutserver.request.ActionOrderByCustomerRequest;
import com.example.projectschedulehaircutserver.request.AllOrderEmployeeAndDateRequest;
import com.example.projectschedulehaircutserver.request.OrderScheduleHaircutRequest;
import com.example.projectschedulehaircutserver.service.email.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@AllArgsConstructor
public class OrderServiceImpl implements OrderService{
    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final EmployeeRepo employeeRepo;
    private final ComboRepo comboRepo;
    private final ServiceRepo serviceRepo;
    private final CouponsRepo couponsRepo;
    private final CartItemRepo cartItemRepo;
    private final CartRepo cartRepo;
    private final CustomerRepo customerRepo;
    private final EmailService emailService;

    // đặt lịch
    @Override
    @Transactional
    public String bookingScheduleHaircut(OrderScheduleHaircutRequest request) throws LoginException, OrderException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)){
            try {
                Customer customer = (Customer) authentication.getPrincipal();
                Set<Employee> employees = new HashSet<>();
                request.getEmployeeId().forEach(eid -> {
                    employees.add(employeeRepo.findById(eid).orElseThrow());
                });

                if (orderRepo.existsByCustomerId(customer.getId())){
                    throw new OrderException("Bạn đang có lịch hẹn chưa hoàn thành, vui lòng hủy lịch trước hoặc thanh toán khi đặt lịch mới");
                }

                LocalTime calculatedEndTime = request.getOrderStartTime().plusMinutes(request.getHaircutTime());

                if (calculatedEndTime.isAfter(LocalTime.of(20, 0))) {
                    throw new OrderException(
                            "Thời gian kết thúc (" + calculatedEndTime + ") vượt quá giờ làm việc (20:00). Vui lòng chọn thời gian sớm hơn."
                    );
                }

                // Kiểm tra lịch trùng
                for (Employee employee : employees) {
                    List<Orders> orders = orderRepo.findAllOrderBooking(employee.getId());
                    if (!orders.isEmpty()) {
                        for (Orders o : orders) {
                            if (o.getStatus() != -1 &&
                                o.getOrderDate().equals(request.getOrderDate()) &&
                                    isTimeBetween(request.getOrderStartTime(), o.getOrderStartTime(), o.getOrderEndTime())) {
                                throw new OrderException(
                                        "Nhân viên bạn muốn đặt lịch hiện đang có lịch trùng với lịch hẹn của bạn, vui lòng chọn ngày khác hoặc thay đổi giờ",
                                        "SCHEDULE_CONFLICT"
                                );
                            }
                        }
                    }
                }

                Coupons coupons = couponsRepo.findCouponByCustomerId(customer.getId()).orElse(null);

                BigDecimal discount = BigDecimal.ZERO;
                if (coupons != null && coupons.getDiscount() != null) {
                    discount = request.getTotalPrice()
                            .multiply(BigDecimal.valueOf(coupons.getDiscount()));
                }
                BigDecimal totalOrder = request.getTotalPrice().subtract(discount);


                Orders orders = Orders.builder()
                        .orderDate(request.getOrderDate())
                        .orderStartTime(request.getOrderStartTime())
                        .orderEndTime(calculatedEndTime)
                        .status(1) // tự động xác nhận
                        .haircutTime(request.getHaircutTime())
                        .totalPrice(totalOrder)
                        .customer(customer)
                        .employees(employees)
                        .build();

                Orders saveOrder = orderRepo.save(orders);

                Combo combo = comboRepo.findComboById(request.getComboId());

                // add combo
                if (combo != null && !employees.isEmpty()){
                    OrderItem orderItem = OrderItem.builder()
                            .orders(saveOrder)
                            .combo(combo)
                            .service(null)
                            .price(combo.getPrice())
                            .build();

                    orderItemRepo.save(orderItem);
                }

                Set<com.example.projectschedulehaircutserver.entity.Service> services = new HashSet<>();

                request.getServiceId().forEach(sid -> {
                    services.add(serviceRepo.findById(sid).orElseThrow());
                });

                if (combo != null){
                    for (com.example.projectschedulehaircutserver.entity.Service service : services) {
                        if (combo.getServices().stream().anyMatch(check -> Objects.equals(check.getId(), service.getId()))) {
                            throw new OrderException(
                                    "Dịch vụ đã có trong combo, vui lòng thêm một dịch vụ khác ngoài combo đã chọn",
                                    "DUPLICATE_SERVICE"
                            );
                        }
                    }
                }

                // add service
                if (!services.isEmpty() && !employees.isEmpty()){
                    services.forEach(service -> {
                        OrderItem orderItem = OrderItem.builder()
                                .orders(saveOrder)
                                .combo(null)
                                .service(service)
                                .price(service.getPrice())
                                .build();

                        orderItemRepo.save(orderItem);
                    });
                }

                Cart cart = cartRepo.findCartByCustomerId(customer.getId()).orElseThrow();
                cartItemRepo.clearCartItemsByCartId(cart.getId());

                sendBookingEmailsToEmployees(saveOrder, customer, employees);

                return "Đặt Lịch Cắt Tóc Thành Công !!!";
            } catch (OrderException e) {
                throw e; // Re-throw để GlobalExceptionHandler xử lý
            } catch (Exception e) {
                throw new RuntimeException("Lỗi hệ thống khi đặt lịch: " + e.getMessage(), e);
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // gửi email đến nhân viên
    private void sendBookingEmailsToEmployees(Orders order, Customer customer, Set<Employee> employees) {
        String bookingDetails = buildBookingDetails(order, customer);

        employees.forEach(employee -> {
            try {
                emailService.sendBookingNotificationToEmployee(
                        employee.getEmail(),
                        employee.getFullName(),
                        customer.getFullName(),
                        bookingDetails
                );
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi gửi email đến nhân viên");
            }
        });
    }

    private String buildBookingDetails(Orders order, Customer customer) {
        return "<p><strong>Thông tin lịch hẹn:</strong></p>" +
                "<ul>" +
                "<li><strong>Khách hàng:</strong> " + customer.getFullName() + "</li>" +
                "<li><strong>Số điện thoại:</strong> " + customer.getPhone() + "</li>" +
                "<li><strong>Ngày:</strong> " + order.getOrderDate() + "</li>" +
                "<li><strong>Giờ bắt đầu:</strong> " + order.getOrderStartTime() + "</li>" +
                "<li><strong>Giờ kết thúc:</strong> " + order.getOrderEndTime() + "</li>" +
                "<li><strong>Tổng thanh toán:</strong> " + order.getTotalPrice() + " VNĐ</li>" +
                "</ul>";
    }

    // lịch hẹn chờ xử lý
    @Override
    public Set<OrderDTO> showOrderByCustomerStatus_0() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Customer customer = (Customer) authentication.getPrincipal();
                return showOrderByCustomerStatus(customer.getId(), 0);
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lịch hẹn đã được xác nhận
    @Override
    public Set<OrderDTO> showOrderByCustomerStatus_1() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Customer customer = (Customer) authentication.getPrincipal();
                return showOrderByCustomerStatus(customer.getId(), 1);
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // lịch hẹn đã thanh toán thành công
    @Override
    public Set<OrderDTO> showOrderByCustomerStatus_2() throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Customer customer = (Customer) authentication.getPrincipal();
                return showOrderByCustomerStatus(customer.getId(), 2);
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    // cập nhật trạng thái lịch hẹn
    @Override
    @Transactional
    public void updateBookingStatus(Integer bookingId, Integer status) {
        Orders order = orderRepo.findOrderByOrderId(bookingId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Nếu là hủy lịch (status == -1) và do nhân viên thực hiện, kiểm tra thời gian
        if (status == -1) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime bookingDateTime = LocalDateTime.of(order.getOrderDate(), order.getOrderStartTime());
            if (bookingDateTime.minusHours(1).isBefore(now)) {
                throw new RuntimeException("Chỉ được phép hủy lịch trước giờ hẹn ít nhất 1 tiếng");
            }
            // Nếu đã xác nhận (status hiện tại là 1), gửi mail xin lỗi khách hàng
            if (order.getStatus() == 1) {
                String subject = "Xin lỗi, lịch hẹn của bạn đã bị hủy";
                String content = "<p>Xin chào <strong>" + order.getCustomer().getFullName() + "</strong>,</p>" +
                        "<p>Chúng tôi rất tiếc phải thông báo rằng lịch hẹn của bạn vào lúc " + order.getOrderStartTime() +
                        " ngày " + order.getOrderDate() + " đã bị hủy do lý do bất khả kháng. Chúng tôi xin lỗi vì sự bất tiện này và mong bạn thông cảm.</p>" +
                        "<p>Vui lòng liên hệ lại với salon để được hỗ trợ đặt lịch mới.</p>";
                emailService.send(order.getCustomer().getEmail(), subject, content);
            }
        }

        // Nếu là hoàn thành (status == 2), chỉ cho phép sau khi dịch vụ kết thúc

        Customer customer = order.getCustomer();

        String employeeName = order.getEmployees().stream()
                .findFirst()
                .map(Employee::getFullName)
                .orElse("Nhân viên salon");

        String bookingDetails = buildBookingDetails(order);

        if (status == 1) {
            emailService.sendBookingConfirmation(
                    order.getCustomer().getEmail(),
                    order.getCustomer().getFullName(),
                    bookingDetails,
                    employeeName
            );
        } else if (status == -1) {
            emailService.sendBookingCancellation(
                    order.getCustomer().getEmail(),
                    order.getCustomer().getFullName(),
                    bookingDetails,
                    employeeName,
                    null
            );
        }

        order.setStatus(status);
        orderRepo.save(order);
    }


    // build thông tin lịch hẹn
    private String buildBookingDetails(Orders order) {
        return "<ul>" +
                "<li><strong>Mã lịch hẹn:</strong> " + order.getId() + "</li>" +
                "<li><strong>Ngày:</strong> " + order.getOrderDate() + "</li>" +
                "<li><strong>Giờ:</strong> " + order.getOrderStartTime() + " - " + order.getOrderEndTime() + "</li>" +
                "<li><strong>Dịch vụ:</strong> " + getServiceNames(order) + "</li>" +
                "<li><strong>Tổng tiền:</strong> " + order.getTotalPrice() + " VNĐ</li>" +
                "</ul>";
    }

    //  Trích xuất tên các dịch vụ và combo có trong đơn hàng để hiển thị trong email.
    private String getServiceNames(Orders order) {
        if (order == null || order.getOrderItems() == null) {
            return "<li>Không có thông tin dịch vụ</li>";
        }

        StringBuilder sb = new StringBuilder();

        order.getOrderItems().forEach(item -> {
            if (item.getService() != null) {
                sb.append("<li>").append(item.getService().getName())
                        .append(" - ").append(item.getPrice()).append(" VNĐ</li>");
            } else if (item.getCombo() != null) {
                sb.append("<li><strong>Combo: ").append(item.getCombo().getName())
                        .append("</strong> - ").append(item.getPrice()).append(" VNĐ<ul>");

                item.getCombo().getServices().forEach(service ->
                        sb.append("<li>").append(service.getName()).append("</li>"));

                sb.append("</ul></li>");
            }
        });

        return sb.toString();
    }

    // huỷ lịch
    @Override
    public void cancelBooking(Integer bookingId, Integer status) {
        Orders orders = orderRepo.findOrderByOrderId(bookingId).orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        // Nếu khách hàng huỷ và trạng thái hiện tại là 1 (đã xác nhận), kiểm tra thời gian
        if (orders.getStatus() == 1 && status == -1) {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime bookingDateTime = LocalDateTime.of(orders.getOrderDate(), orders.getOrderStartTime());
            if (bookingDateTime.minusHours(1).isBefore(now)) {
                throw new RuntimeException("Chỉ được phép hủy lịch trước giờ hẹn ít nhất 1 tiếng");
            }
        }

        orders.setStatus(status);
        orderRepo.save(orders);
    }

    //
    @Override
    public Set<OrderDTO> findAllOrderByEmployeeAndDate(AllOrderEmployeeAndDateRequest request) throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
//                Employee employee = (Employee) authentication.getPrincipal();
//                return orderRepo.findAllOrderByEmployeeAndDate(employee.getId(), 1, request.getOrderDate())
//                        .stream()
//                        .map(OrderDTO::new)
//                        .collect(Collectors.toSet());

                return null;
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    @Transactional
    @Override
    public String ConfirmDoneOrCancelOrderedByCustomer(ActionOrderByCustomerRequest request) throws LoginException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            try {
                Customer customer = (Customer) authentication.getPrincipal();

                orderRepo.updateOrdersByStatus(request.getOrderId(), customer.getId(), request.getStatus());

                return "Thành Công";
            } catch (Exception e){
                throw new RuntimeException(e.getMessage());
            }
        } else {
            throw new LoginException("Bạn Chưa Đăng Nhập");
        }
    }

    private Set<OrderDTO> convertToOrderDTO(List<Object[]> rawOrders) {
        Map<String, OrderDTO> groupedOrders = new LinkedHashMap<>();

        for (Object[] row : rawOrders) {
            Integer id = (Integer) row[0];
            Date orderDate = (Date) row[1];
            java.sql.Time orderStartTime = (java.sql.Time) row[2];
            java.sql.Time orderEndTime = (java.sql.Time) row[3];
            String employeeName = (String) row[4];
            String comboName = (String) row[5];
            String serviceName = (String) row[6];
            BigDecimal totalPrice = (BigDecimal) row[7];
            Integer status = (Integer) row[8];

            String key = id + "-" + orderDate + "-" + orderStartTime + "-" + orderEndTime;

            OrderDTO dto = groupedOrders.getOrDefault(key,
                    OrderDTO.builder()
                            .id(id)
                            .orderDate(orderDate)
                            .orderStartTime(orderStartTime)
                            .orderEndTime(orderEndTime)
                            .employeeName(new ArrayList<>())
                            .serviceName(new ArrayList<>())
                            .totalPrice(totalPrice)
                            .status(status)
                            .build()
            );

            if (employeeName != null && !dto.getEmployeeName().contains(employeeName)) {
                dto.getEmployeeName().add(employeeName);
            }

            String finalService = comboName != null ? comboName : serviceName;
            if (finalService != null && !dto.getServiceName().contains(finalService)) {
                dto.getServiceName().add(finalService);
            }

            groupedOrders.put(key, dto);
        }

        return new LinkedHashSet<>(groupedOrders.values());
    }

    public Set<OrderDTO> showOrderByCustomerStatus(Integer customerId, Integer status){
        List<Object[]> objects = orderRepo.findOrdersByCustomerId(customerId, status);
        return convertToOrderDTO(objects);
    }


    public boolean isTimeBetween(LocalTime target, LocalTime startTime, LocalTime endTime) {
        if (endTime.isAfter(startTime)) {
            return target.equals(startTime) || target.isAfter(startTime) && target.isBefore(endTime);
        } else {
            return target.isAfter(startTime) || target.isBefore(endTime);
        }
    }


    // Nhắc lịch trước 1 giờ (chạy mỗi phút)
    @Scheduled(cron = "0 * * * * ?")
    public void sendAppointmentReminders() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneHourLater = now.plusHours(1);

        List<Orders> upcomingAppointments = orderRepo.findByStatusAndOrderDateAndOrderStartTimeBetween(
                1, // lịch hẹn đã được xác nhận
                oneHourLater.toLocalDate(),
                oneHourLater.toLocalTime().minusMinutes(1),
                oneHourLater.toLocalTime().plusMinutes(1)
        );

        upcomingAppointments.forEach(appointment -> {
            String subject = "⏰ Nhắc lịch hẹn cắt tóc sắp tới";
            String content = buildReminderContent(appointment);
            emailService.send(appointment.getCustomer().getEmail(), subject, content);
        });
    }

    private String buildReminderContent(Orders appointment) {
        return "<p>Xin chào <strong>" + appointment.getCustomer().getFullName() + "</strong>,</p>" +
                "<p>Bạn có lịch hẹn cắt tóc sau 1 giờ nữa:</p>" +
                "<ul>" +
                "<li><strong>Thời gian:</strong> " + appointment.getOrderStartTime() + " - " + appointment.getOrderEndTime() + "</li>" +
                "<li><strong>Địa điểm:</strong> Salon của chúng tôi</li>" +
                "</ul>" +
                "<p>Vui lòng đến đúng giờ hẹn. Nếu không thể đến, vui lòng liên hệ salon để hủy/hỗn lịch.</p>";
    }

    // Huỷ lịch chưa thanh toán vào cuối ngày (23:50 mỗi ngày)
    @Scheduled(cron = "0 50 23 * * ?")
    public void cancelUnpaidAppointments() {
        LocalDate today = LocalDate.now();
        List<Orders> unpaidAppointments = orderRepo.findByStatusAndOrderDateBefore(
                1, //  đã xác nhận nhưng chưa thanh toán
                today
        );

        unpaidAppointments.forEach(appointment -> {
            appointment.setStatus(-1);
            orderRepo.save(appointment);

            String subject = "❌ Lịch hẹn đã bị huỷ do không thanh toán";
            String content = buildCancellationContent(appointment);
            emailService.send(appointment.getCustomer().getEmail(), subject, content);
        });
    }

    // Huỷ lịch đã xác nhận nhưng quá giờ chưa thanh toán (chạy mỗi 5 phút)
    @Scheduled(cron = "0 */5 * * * ?")
    public void cancelOverdueAppointments() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        // Lấy các đơn đã xác nhận, ngày hôm nay, kết thúc trước thời điểm hiện tại
        List<Orders> overdueAppointments = orderRepo.findByStatusAndOrderDateAndOrderEndTimeBefore(
            Orders.STATUS_CONFIRMED, today, now
        );
        overdueAppointments.forEach(appointment -> {
            appointment.setStatus(Orders.STATUS_CANCELLED);
            orderRepo.save(appointment);
            String subject = "❌ Lịch hẹn đã bị huỷ do quá giờ không thanh toán";
            String content = buildCancellationContent(appointment);
            emailService.send(appointment.getCustomer().getEmail(), subject, content);
        });
    }

    private String buildCancellationContent(Orders appointment) {
        return "<p>Xin chào <strong>" + appointment.getCustomer().getFullName() + "</strong>,</p>" +
                "<p>Lịch hẹn của bạn ngày " + appointment.getOrderDate() + " đã bị huỷ do không hoàn thành thanh toán.</p>" +
                "<p>Nếu đây là sự nhầm lẫn, vui lòng liên hệ salon để được hỗ trợ.</p>";
    }
}
