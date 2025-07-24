package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.dto.TimeDTO;
import com.example.projectschedulehaircutserver.entity.Time;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface TimeRepo extends JpaRepository<Time, Integer> {

    @Query(value = """
        SELECT
            t.id AS id,
            t.time_name AS timeName,
            CASE
                WHEN EXISTS (
                    SELECT 1
                    FROM orders o
                    JOIN order_employee oe ON o.id = oe.order_id
                    WHERE oe.employee_id = :employeeId
                    AND o.order_date = :orderDate
                    AND o.status != -1
                    AND TIME(t.time_name) BETWEEN o.order_start_time AND o.order_end_time
                ) THEN 1
                ELSE 0
            END AS isBusy
        FROM time t
        JOIN employee_time et ON t.id = et.time_id
        WHERE et.employee_id = :employeeId
        ORDER BY t.time_name
    """, nativeQuery = true)
    Set<Object[]> findTimeByEmployeeIdAndOrderDate(
            @Param("employeeId") Integer employeeId,
            @Param("orderDate") LocalDate orderDate
    );

    @Query("select new com.example.projectschedulehaircutserver.dto.TimeDTO(t.id, t.timeName) from Time t")
    Set<TimeDTO> findAllTimes();
}
