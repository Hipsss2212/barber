package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.response.AccountManagementResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepo extends JpaRepository<Account, Integer> {

    @Query(value = """
        SELECT
            a.id,
            CASE
                WHEN r.name = 'EMPLOYEE' THEN 'STAFF'
                WHEN r.name = 'USER' THEN 'CUSTOMER'
                ELSE 'UNKNOWN'
            END AS type,
            a.username,
            a.fullname,
            a.age,
            a.address,
            a.phone,
            a.email,
            r.name AS role,
            a.is_blocked AS isBlocked,
            GROUP_CONCAT(DISTINCT t.time_name SEPARATOR ',') AS times,
            COUNT(DISTINCT o.id) AS bookingCount
        FROM account a
        LEFT JOIN role r ON a.role_id = r.id
        LEFT JOIN customer c ON c.id = a.id
        LEFT JOIN employee e ON e.id = a.id
        LEFT JOIN employee_time et ON e.id = et.employee_id
        LEFT JOIN time t ON et.time_id = t.id
        LEFT JOIN orders o ON o.customer_id = c.id
        GROUP BY a.id, r.name, a.username, a.fullname, a.age, a.address, a.phone, a.email, a.is_blocked
        ORDER BY a.id ASC
    """, nativeQuery = true)
    List<Object[]> getAllAccountsRaw();


    @Query("SELECT COUNT(a) > 0 FROM Account a WHERE a.userName = :userName")
    boolean existsByUserName(@Param("userName") String userName);

    @Query("SELECT COUNT(a) > 0 FROM Account a WHERE a.email = :email")
    boolean existsByEmail(@Param("email") String email);

    @Query("SELECT COUNT(a) > 0 FROM Account a WHERE a.phone = :phone")
    boolean existsByPhone(@Param("phone") String phone);

    @Query("select a from Account a where a.id = :accId")
    Optional<Account> findAccountById(@Param("accId") Integer accId);

    @Query("select a from Account a where a.userName = :userName")
    Optional<Account> findByUserName(@Param("userName") String userName);

    @Query("select a from Account a where a.email = :email")
    Optional<Account> findByEmail(@Param("email") String email);

    @Query("select a from Account a where a.resetPasswordToken = :token")
    Optional<Account> findByResetPasswordToken(@Param("token") String token);

    @Query("select a from Account a where a.verificationToken = :token")
    Optional<Account> findByVerificationToken(@Param("token") String token);
}
