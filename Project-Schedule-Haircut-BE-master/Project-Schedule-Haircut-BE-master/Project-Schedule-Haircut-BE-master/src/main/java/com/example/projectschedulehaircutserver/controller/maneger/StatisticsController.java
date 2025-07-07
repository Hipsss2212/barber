package com.example.projectschedulehaircutserver.controller.maneger;

import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.entity.Orders;
import com.example.projectschedulehaircutserver.entity.OrderItem;
import com.example.projectschedulehaircutserver.repository.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class StatisticsController {

    @Autowired
    private OrderRepo orderRepo;

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        List<Orders> orders = orderRepo.findAll() != null ? orderRepo.findAll() : new ArrayList<>();
        if (from != null && to != null) {
            orders = orders.stream()
                    .filter(o -> o.getStatus() != null && o.getStatus() == 2 && o.getOrderDate() != null && !o.getOrderDate().isBefore(from) && !o.getOrderDate().isAfter(to))
                    .toList();
        } else {
            orders = orders.stream()
                    .filter(o -> o.getStatus() != null && o.getStatus() == 2)
                    .toList();
        }

        // Tổng doanh thu
        BigDecimal totalRevenue = orders.stream()
                .map(Orders::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Doanh thu theo ngày
        Map<LocalDate, BigDecimal> revenueByDay = new TreeMap<>();
        for (Orders o : orders) {
            if (o.getOrderDate() != null && o.getTotalPrice() != null)
                revenueByDay.merge(o.getOrderDate(), o.getTotalPrice(), BigDecimal::add);
        }

        // Doanh thu theo nhân viên
        Map<String, BigDecimal> revenueByEmployee = new HashMap<>();
        for (Orders o : orders) {
            if (o.getTotalPrice() != null && o.getEmployees() != null)
                for (Employee e : o.getEmployees()) {
                    if (e != null && e.getFullName() != null)
                        revenueByEmployee.merge(e.getFullName(), o.getTotalPrice(), BigDecimal::add);
                }
        }

        // Danh sách chi tiết từng dịch vụ/ngày/nhân viên (ưu tiên combo nếu có)
        List<Map<String, Object>> detailList = new ArrayList<>();
        for (Orders o : orders) {
            if (o.getEmployees() != null && !o.getEmployees().isEmpty() && o.getOrderItems() != null) {
                Employee e = o.getEmployees().iterator().next();
                if (e == null || e.getFullName() == null) continue;
                // Ưu tiên combo
                OrderItem comboItem = o.getOrderItems().stream()
                    .filter(item -> item != null && item.getCombo() != null && item.getCombo().getName() != null)
                    .findFirst().orElse(null);
                if (comboItem != null) {
                    detailList.add(Map.of(
                        "employee", e.getFullName(),
                        "service", "Combo: " + comboItem.getCombo().getName(),
                        "amount", comboItem.getPrice() != null ? comboItem.getPrice() : BigDecimal.ZERO,
                        "date", o.getOrderDate() != null ? o.getOrderDate().toString() : ""
                    ));
                } else {
                    // Nếu không có combo, lấy dịch vụ lẻ
                    for (OrderItem item : o.getOrderItems()) {
                        if (item == null || item.getService() == null || item.getService().getName() == null) continue;
                        detailList.add(Map.of(
                            "employee", e.getFullName(),
                            "service", item.getService().getName(),
                            "amount", item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO,
                            "date", o.getOrderDate() != null ? o.getOrderDate().toString() : ""
                        ));
                    }
                }
            }
        }

        Map<String, Object> res = new HashMap<>();
        res.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        res.put("revenueByDay", revenueByDay != null ? revenueByDay.entrySet().stream()
                .map(e -> Map.of("date", e.getKey().toString(), "amount", e.getValue()))
                .collect(Collectors.toList()) : new ArrayList<>());
        res.put("revenueByEmployee", revenueByEmployee != null ? revenueByEmployee.entrySet().stream()
                .map(e -> Map.of("employee", e.getKey(), "amount", e.getValue()))
                .collect(Collectors.toList()) : new ArrayList<>());
        res.put("detailList", detailList);

        return ResponseEntity.ok(res);
    }

    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String search) {

        List<Orders> ordersForTransactions = orderRepo.findAll() != null ? orderRepo.findAll() : new ArrayList<>();
        ordersForTransactions = ordersForTransactions.stream()
                .filter(o -> o.getStatus() != null && o.getStatus() == 2)
                .toList();
        if (from != null && to != null) {
            ordersForTransactions = ordersForTransactions.stream()
                    .filter(o -> o.getOrderDate() != null && !o.getOrderDate().isBefore(from) && !o.getOrderDate().isAfter(to))
                    .toList();
        }
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            ordersForTransactions = ordersForTransactions.stream()
                    .filter(o -> (o.getCustomer() != null && o.getCustomer().getFullName() != null && o.getCustomer().getFullName().toLowerCase().contains(searchLower))
                            || (o.getId() != null && o.getId().toString().toLowerCase().contains(searchLower)))
                    .toList();
        }
        List<Map<String, Object>> transactions = new ArrayList<>();
        for (Orders o : ordersForTransactions) {
            transactions.add(Map.of(
                    "id", o.getId() != null ? ("GD" + String.format("%03d", o.getId())) : "",
                    "date", o.getOrderDate() != null ? o.getOrderDate().toString() : "",
                    "customer", (o.getCustomer() != null && o.getCustomer().getFullName() != null) ? o.getCustomer().getFullName() : "",
                    "amount", o.getTotalPrice() != null ? o.getTotalPrice() : BigDecimal.ZERO,
                    "status", "success"
            ));
        }

        return ResponseEntity.ok(transactions);
    }
} 