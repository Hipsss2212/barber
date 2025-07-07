package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.Manager;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ManagerRepo extends JpaRepository<Manager, Integer> {
    Optional<Manager> findManagerByUseName(String useName);
}
