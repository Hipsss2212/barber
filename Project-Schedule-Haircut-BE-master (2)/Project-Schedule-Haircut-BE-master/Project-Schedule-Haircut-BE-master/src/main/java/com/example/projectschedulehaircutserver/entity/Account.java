package com.example.projectschedulehaircutserver.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "Account")
@Inheritance(strategy = InheritanceType.JOINED)
public class Account implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username", unique = true, nullable = false, length = 20)
    private String userName;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fullname", nullable = false, length = 50)
    private String fullName;

    @Column(name = "age", nullable = false)
    private Integer age;

    @Column(name = "address", nullable = false, length = 100)
    private String address;

    @Column(name = "phone", nullable = false, length = 10, unique = true)
    private String phone;

    @Column(name = "avatar", nullable = true)
    private String avatar;

    @Column(name = "is_blocked", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isBlocked;

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

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.MERGE)
    @JsonIgnore
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @Column(name = "provider")
    private String provider; // "LOCAL" hoặc "GOOGLE"

    @Column(name = "provider_id")
    private String providerId; // Google user id/email

    @Column(name = "is_verified", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isVerified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private LocalDateTime verificationTokenExpiry;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.getName()));
    }

    @Override
    public String getUsername() {
        return userName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getPassword(){
        return password;
    }
}
