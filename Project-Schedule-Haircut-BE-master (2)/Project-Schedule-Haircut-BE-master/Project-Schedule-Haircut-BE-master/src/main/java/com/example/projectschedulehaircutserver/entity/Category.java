package com.example.projectschedulehaircutserver.entity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "Category")
public class Category {
    public enum CategoryType {
        HAIRCUT, // Dịch vụ cắt tóc
        SPA      // Dịch vụ spa
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "image", nullable = false)
    private String image;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategoryType type;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Service> services = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "category", cascade = CascadeType.ALL)
    private Set<Combo> combos = new HashSet<>();
}
