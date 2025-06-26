package com.example.projectschedulehaircutserver.entity;

import lombok.*;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "cart")
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false, unique = true)
    private Customer customer;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "cart")
    private Set<CartItem> cartItems = new HashSet<>();
}
