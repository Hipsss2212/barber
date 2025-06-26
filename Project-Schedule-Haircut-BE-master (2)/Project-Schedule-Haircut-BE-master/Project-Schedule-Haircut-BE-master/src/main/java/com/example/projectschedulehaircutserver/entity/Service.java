package com.example.projectschedulehaircutserver.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "service")
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "haircut_time", nullable = false)
    private Integer haircutTime;

    @Column(name = "image", nullable = false)
    private String image;

    @ManyToMany(mappedBy = "services", fetch = FetchType.LAZY)
    private Set<Combo> combos = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "service")
    private Set<OrderItem> orderItems = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "service")
    private Set<CartItem> cartItems = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @CreationTimestamp
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
