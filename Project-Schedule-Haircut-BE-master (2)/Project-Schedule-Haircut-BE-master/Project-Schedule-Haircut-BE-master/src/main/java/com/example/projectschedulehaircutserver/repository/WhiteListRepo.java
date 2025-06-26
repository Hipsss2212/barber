package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.WhiteList;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface WhiteListRepo extends JpaRepository<WhiteList, Long> {
    @Query("select wt from WhiteList wt where wt.token = :token")
    Optional<WhiteList> findByToken(@Param("token") String token);

    @Query("select wt from WhiteList wt where wt.userId = :userId")
    Optional<WhiteList> findByUserId(@Param("userId") String userId);

    @Transactional
    @Modifying
    @Query("DELETE FROM WhiteList w WHERE w.token = :token")
    void deleteByToken(@Param("token") String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM WhiteList w WHERE w.expirationToken < :cutoffDate")
    void deleteByExpirationTokenBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
}
