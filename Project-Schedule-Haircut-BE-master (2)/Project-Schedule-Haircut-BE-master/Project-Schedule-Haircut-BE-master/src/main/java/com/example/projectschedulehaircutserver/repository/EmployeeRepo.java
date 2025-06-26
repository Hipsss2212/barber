package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.dto.EmployeeDTO;
import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentByHourResponse;
import com.example.projectschedulehaircutserver.response.EmployeeAppointmentNeedsConfirmationResponse;
import com.example.projectschedulehaircutserver.response.EmployeeBookedStaffResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface EmployeeRepo extends JpaRepository<Employee, Integer> {
//    Optional<Employee> findEmployeeByAccount_UserName(String account_userName);

    @Query("SELECT e FROM Employee e WHERE e.userName = :username")
    Optional<Employee> findByEmployeeUsername(@Param("username") String username);


    @Query("SELECT new com.example.projectschedulehaircutserver.dto.EmployeeDTO(e.id, e.userName, e.fullName, e.age, e.address, e.phone, e.avatar, " +
            "CASE WHEN e.employeeType = 'HAIR_STYLIST_STAFF' THEN 0 ELSE 1 END) " +
            "FROM Employee e WHERE e.isBlocked = false")
    Set<EmployeeDTO> findAllEmployee();

    @Query("SELECT e FROM Employee e WHERE e.isBlocked = false")
    Set<Employee> getAllEmployees();

    @Query("SELECT e FROM Employee e WHERE e.fullName = :fullName")
    Optional<Employee> findEmployeeByName(@Param("fullName") String fullName);

    @Query(value = "CALL totalPriceByEmployeeAndDay(:employeeId, :day)", nativeQuery = true)
    Object[] totalPriceByEmployeeAndDay(@Param("employeeId") Integer employeeId,@Param("day") Integer day);

    @Query("SELECT new com.example.projectschedulehaircutserver.response.EmployeeBookedStaffResponse(" +
            "CAST(COUNT(o.id) AS string), " +
            "CAST(SUM(CASE WHEN o.status = 2 THEN 1 ELSE 0 END) AS string), " +
            "CAST(SUM(CASE WHEN o.status = 0 THEN 1 ELSE 0 END) AS string), " +
            "CAST(SUM(CASE WHEN o.status = -1 THEN 1 ELSE 0 END) AS string)) " +
            "FROM Orders o " +
            "JOIN o.employees e " +
            "WHERE e.id = :employeeId")
    EmployeeBookedStaffResponse getEmployeeBookingStats(@Param("employeeId") Integer employeeId);


    @Query("SELECT new com.example.projectschedulehaircutserver.response.EmployeeAppointmentByHourResponse(" +
            "FUNCTION('HOUR', o.orderStartTime), " + // Lấy giờ dạng số (0-23)
            "COUNT(o.id)) " +
            "FROM Orders o " +
            "JOIN o.employees e " +
            "WHERE e.id = :employeeId AND o.orderDate = CURRENT_DATE " +
            "GROUP BY FUNCTION('HOUR', o.orderStartTime) " + // Group theo giờ
            "ORDER BY FUNCTION('HOUR', o.orderStartTime) ASC") // Order theo giờ
    List<EmployeeAppointmentByHourResponse> getAppointmentsByHour(@Param("employeeId") Integer employeeId);


    @Query("SELECT o, c.fullName, s.name " +
            "FROM Orders o " +
            "JOIN o.customer c " +
            "JOIN o.orderItems oi " +
            "JOIN oi.service s " +
            "JOIN o.employees e " +
            "WHERE e.id = :employeeId " +
            "AND o.status IN (0, 1) " +
            "AND o.orderDate >= CURRENT_DATE " +
            "ORDER BY o.orderDate ASC, o.orderStartTime ASC")
    List<Object[]> getRawAppointmentsData(@Param("employeeId") Integer employeeId);

    @Query("select e FROM Employee e WHERE e.id = :employeeId")
    Optional<Employee> findByAccountId(@Param("employeeId") Integer employeeId);


}
