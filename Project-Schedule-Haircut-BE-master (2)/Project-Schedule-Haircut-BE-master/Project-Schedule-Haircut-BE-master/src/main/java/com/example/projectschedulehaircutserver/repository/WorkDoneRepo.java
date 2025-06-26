package com.example.projectschedulehaircutserver.repository;

import com.example.projectschedulehaircutserver.entity.WorkDone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkDoneRepo extends JpaRepository<WorkDone, Integer> {
}
