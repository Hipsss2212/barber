package com.example.projectschedulehaircutserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "time")
public class Time {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "time_name", nullable = false, length = 5)
    private String timeName;

    @ManyToMany(mappedBy = "times", fetch = FetchType.LAZY)
    private Set<Employee> employees = new HashSet<>();
}
