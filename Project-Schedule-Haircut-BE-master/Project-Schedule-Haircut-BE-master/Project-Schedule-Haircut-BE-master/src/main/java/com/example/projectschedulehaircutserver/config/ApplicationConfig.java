package com.example.projectschedulehaircutserver.config;

import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Employee;
import com.example.projectschedulehaircutserver.entity.Manager;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.repository.CustomerRepo;
import com.example.projectschedulehaircutserver.repository.EmployeeRepo;
import com.example.projectschedulehaircutserver.repository.ManagerRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Optional;

@Configuration
@EnableTransactionManagement
@RequiredArgsConstructor
public class ApplicationConfig {
    private final CustomerRepo customerRepo;
    private final EmployeeRepo employeeRepo;
    private final AccountRepo accountRepo;
    private final ManagerRepo managerRepo;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // Ưu tiên kiểm tra Manager (vì riêng biệt)
            Optional<Manager> manager = managerRepo.findManagerByUseName(username);
            if (manager.isPresent()) {
                return manager.get();
            }

            Optional<Account> account = accountRepo.findByUserName(username);
            if (account.isPresent()) {
                return account.get();
            }

            throw new UsernameNotFoundException("Username not found");
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:3001")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowCredentials(true);
            }
        };
    }
}
