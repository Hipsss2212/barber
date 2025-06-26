package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.BlackList;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BlackListRepo extends JpaRepository<BlackList,Long> {
    @Query("select bl from BlackList bl where bl.token = :token")
    Optional<BlackList> findByToken(@Param("token") String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM BlackList b WHERE b.createdAt < :cutoffDate")
    void deleteByCreatedAtBefore(@Param("cutoffDate") LocalDateTime cutoffDate);
}
