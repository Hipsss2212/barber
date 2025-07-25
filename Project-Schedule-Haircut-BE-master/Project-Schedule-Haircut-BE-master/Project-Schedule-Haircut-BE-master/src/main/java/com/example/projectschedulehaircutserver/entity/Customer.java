package com.example.projectschedulehaircutserver.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "customer")
@PrimaryKeyJoinColumn(name = "id")
public class Customer extends Account{
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customer")
    private Set<Orders> orders = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "customer")
    private Set<Comment> comments = new HashSet<>();
}
