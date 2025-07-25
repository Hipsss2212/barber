package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Orders, Integer> {
    @Query(value = "SELECT o.* FROM orders o JOIN order_employee oe ON o.id = oe.order_id WHERE oe.employee_id = :employeeId", nativeQuery = true)
    List<Orders> findAllOrderBooking(@Param("employeeId") Integer employeeId);

    @Query(value = "SELECT " +
            "o.id AS order_id , " +
            "o.order_date, " +
            "o.order_start_time, " +
            "o.order_end_time, " +
            "a.fullname AS employee_fullname, " +
            "c2.name AS combo_name, " +
            "s.name AS service_name, " +
            "o.total_price, " +
            "o.status, " +
            "o.coupon_code, " +
            "o.coupon_discount " +
            "FROM orders o " +
            "JOIN customer c ON c.id = o.customer_id " +
            "JOIN orderitem oi ON o.id = oi.order_id " +
            "JOIN order_employee oe ON o.id = oe.order_id " +
            "JOIN employee e ON oe.employee_id = e.id " +
            "JOIN Account a ON a.id = e.id " +
            "LEFT JOIN service s ON oi.service_id = s.id " +
            "LEFT JOIN combo c2 ON oi.combo_id = c2.id " +
            "WHERE c.id = :customerId AND o.status = :status", nativeQuery = true)
    List<Object[]> findOrdersByCustomerId(@Param("customerId") Integer customerId, @Param("status") Integer status);

    @Query(value = "CALL findAllOrderByEmployeeAndDate(:employeeId, :status, :orderDate)", nativeQuery = true)
    List<Object[]> findAllOrderByEmployeeAndDate(@Param("employeeId") Integer employeeId, @Param("status") Integer status, @Param("orderDate") Date orderDate);

    @Query("select o from Orders o where o.id = :orderId")
    Optional<Orders> findOrderByOrderId(@Param("orderId") Integer orderId);

    @Modifying
    @Query("update Orders o set o.status = :status where o.id = :orderId and o.customer.id = :customerId and o.status = 1")
    void updateOrdersByStatus(@Param("orderId") Integer orderId, @Param("customerId") Integer customerId, @Param("status") Integer status);

    @Query("SELECT o FROM Orders o WHERE o.status = :status " +
            "AND o.orderDate = :date " +
            "AND o.orderStartTime BETWEEN :start AND :end")
    List<Orders> findByStatusAndOrderDateAndOrderStartTimeBetween(
            @Param("status") Integer status,
            @Param("date") LocalDate date,
            @Param("start") LocalTime start,
            @Param("end") LocalTime end
    );

    // Tìm các lịch hẹn đã xác nhận nhưng chưa thanh toán trước ngày cụ thể
    @Query("SELECT o FROM Orders o WHERE o.status = :status " +
            "AND o.orderDate < :date")
    List<Orders> findByStatusAndOrderDateBefore(
            @Param("status") Integer status,
            @Param("date") LocalDate date
    );

    @Query("SELECT o FROM Orders o WHERE o.status = :status AND o.orderDate = :date AND o.orderEndTime < :endTime")
    List<Orders> findByStatusAndOrderDateAndOrderEndTimeBefore(
        @Param("status") int status,
        @Param("date") LocalDate date,
        @Param("endTime") LocalTime endTime
    );

    @Query("select count(o) > 0 from Orders o where o.customer.id = :customerId and o.status in (0, 1)")
    boolean existsByCustomerId(@Param("customerId") Integer customerId);
}
