package com.example.projectschedulehaircutserver.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "haircut_time", nullable = false)
    private Integer haircutTime;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    @Column(name = "order_date", nullable = false)
    private LocalDate orderDate;

    @Column(name = "order_start_time", nullable = false)
    private LocalTime orderStartTime;

    @Column(name = "order_end_time", nullable = false)
    private LocalTime orderEndTime;

    @Column(name = "coupon_code")
    private String couponCode;

    @Column(name = "coupon_discount")
    private Float couponDiscount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JsonIgnore
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "orders")
    private Set<OrderItem> orderItems = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "orders")
    private Set<WorkDone> workDones = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "order_employee",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id"))
    private Set<Employee> employees = new HashSet<>();

    // Trạng thái đơn hàng
    public static final int STATUS_CONFIRMED = 1; // Đã xác nhận
    public static final int STATUS_CANCELLED = -1; // Đã hủy
    public static final int STATUS_PAID = 2; // Đã thanh toán
    public static final int STATUS_WAITING_PAYMENT = 3; // Đã hoàn thành, chờ thanh toán

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
