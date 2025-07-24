package com.example.projectschedulehaircutserver.service.authentication;

import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.entity.Cart;
import com.example.projectschedulehaircutserver.entity.Customer;
import com.example.projectschedulehaircutserver.entity.Role;
import com.example.projectschedulehaircutserver.exeption.*;
import com.example.projectschedulehaircutserver.repository.*;
import com.example.projectschedulehaircutserver.request.LoginRequest;
import com.example.projectschedulehaircutserver.request.RefreshTokenRequest;
import com.example.projectschedulehaircutserver.request.RegisterRequest;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.email.EmailService;
import com.example.projectschedulehaircutserver.service.jwt.JwtService;
import com.example.projectschedulehaircutserver.service.redis.RedisService;
import io.jsonwebtoken.Claims;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService{
    private final CustomerRepo customerRepo;
    private final CartRepo cartRepo;
    private final PasswordEncoder encoder;
    private final RoleRepo roleRepo;
    private final AccountRepo accountRepo;
    private final EmployeeRepo employeeRepo;
    private final ManagerRepo managerRepo;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final RedisService redisService;
    private final EmailService emailService;

    // đăng ký dành cho khách hàng
    @Override
    @Transactional
    public String registerUser(RegisterRequest request) throws RegisterException {
        try {
            Role role = roleRepo.findById(2)
                    .orElseThrow(() -> new RegisterException("Không tìm thấy vai trò mặc định."));

            if (accountRepo.existsByUserName(request.getUserName())) {
                throw new RuntimeException("Tên đăng nhập đã được sử dụng");
            }

            if (accountRepo.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã được sử dụng");
            }

            if (accountRepo.existsByPhone(request.getPhone())) {
                throw new RuntimeException("Số điện thoại đã được sử dụng");
            }

            // Tạo customer như một account
            Customer customer = new Customer();
            customer.setFullName(request.getFullName());
            customer.setUserName(request.getUserName());
            customer.setEmail(request.getEmail());
            customer.setAvatar("https://i.postimg.cc/pVs3qTMy/image.png");
            customer.setPassword(encoder.encode(request.getPassword()));
            customer.setRole(role);
            customer.setAge(request.getAge());
            customer.setAddress(request.getAddress());
            customer.setPhone(request.getPhone());
            customer.setIsBlocked(false);
            customer.setIsVerified(false);
            
            // Tạo mã xác thực 6 chữ số
            String verificationCode = String.format("%06d", new Random().nextInt(999999));
            customer.setVerificationToken(verificationCode);
            customer.setVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

            customerRepo.save(customer);

            // Gán cart cho customer
            Cart cart = Cart.builder()
                    .customer(customer)
                    .build();
            cartRepo.save(cart);

            // Gửi email xác thực
            emailService.sendVerificationEmail(customer.getEmail(), customer.getFullName(), verificationCode);

            return "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã xác thực tài khoản.";
        } catch (DataIntegrityViolationException e) {
            throw new RegisterException("Lỗi hệ thống khi đăng ký");
        }
    }

    @Override
    public String verifyEmail(String code) {
        Optional<Account> optional = accountRepo.findByVerificationToken(code);
        if (optional.isEmpty()) {
            return "Mã xác thực không hợp lệ.";
        }
        Account account = optional.get();
        if (Boolean.TRUE.equals(account.getIsVerified())) {
            return "Tài khoản đã được xác thực trước đó.";
        }
        if (account.getVerificationTokenExpiry() == null || account.getVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
            return "Mã xác thực đã hết hạn.";
        }
        account.setIsVerified(true);
        account.setVerificationToken(null);
        account.setVerificationTokenExpiry(null);
        accountRepo.save(account);
        return "Xác thực tài khoản thành công. Bạn có thể đăng nhập.";
    }

    // đăng nhập
    @Override
    public AuthenticationResponse authenticate(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUserName(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        if (userDetails instanceof Account account) {
            if (Boolean.TRUE.equals(account.getIsBlocked())) {
                throw new AccountBlockedException("Tài khoản của bạn bị khóa.");
            }
            
            // Kiểm tra xác thực email
            if (!Boolean.TRUE.equals(account.getIsVerified())) {
                throw new AccountBlockedException("Tài khoản chưa được xác thực. Vui lòng kiểm tra email và xác thực tài khoản.");
            }
        }

        if (jwtService.isTokenInWhiteList(userDetails.getUsername())){
            throw new AlreadyLoggedInException("Tài khoản đang được đăng nhập ở một nơi khác.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String accessToken = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateAndSaveRefreshToken(userDetails);

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));

        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .username(userDetails.getUsername())
                .role(role)
                .build();
    }

    // lấy token từ refresh token
    @Override
    public AuthenticationResponse refreshToken(RefreshTokenRequest request) throws RefreshTokenException {
        String newAccessToken = jwtService.generateNewAccessTokenFromRefreshToken(request.getRefreshToken());
        String username = jwtService.extractUsername(request.getRefreshToken());

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));

        return AuthenticationResponse.builder()
                .token(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .username(username)
                .role(role)
                .build();
    }

    // yêu cầu đổi mật khẩu
    @Override
    public String requestChangePassword(String email) throws CustomerException {
        Customer customer = customerRepo.findCustomerByEmail(email)
                .orElseThrow(() -> new CustomerException("Email không tồn tại hoặc không có quyền đổi mật khẩu"));

        // Check request limit
        if (redisService.getOTPRequestCount(email) >= 3) {
            throw new CustomerException("Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 30 phút");
        }

        String code = generateRandomCode(6);
        redisService.saveOTP(email, code, 10);
        redisService.incrementOTPRequestCount(email);

        emailService.sendPasswordResetEmail(email, customer.getFullName(), code);

        return "Mã xác thực đã được gửi. Vui lòng kiểm tra email của bạn.";
    }


    // render code
    private String generateRandomCode(int length) {
        return UUID.randomUUID().toString()
                .replace("-", "")
                .substring(0, length)
                .toUpperCase();
    }


    // đổi mật khẩu
    @Override
    public String changePassword(String email, String code, String newPassword) throws CustomerException {
        String savedCode = redisService.getOTP(email);
        if (savedCode == null) {
            throw new CustomerException("Mã xác thực hết hạn hoặc không tồn tại");
        }
        if (!savedCode.equals(code)) {
            throw new CustomerException("Mã xác thực không đúng");
        }

        Customer customer = customerRepo.findCustomerByEmail(email)
                .orElseThrow(() -> new CustomerException("Không tìm thấy tài khoản với email này"));

        if (encoder.matches(newPassword, customer.getPassword())) {
            throw new CustomerException("Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        customer.setPassword(encoder.encode(newPassword));
        customerRepo.save(customer);

        redisService.deleteOTP(email);
        redisService.deleteOTPRequestCount(email);

        return "Đổi mật khẩu thành công";
    }

    @Override
    public String resendVerificationCode(String email) {
        Optional<Account> optional = accountRepo.findByEmail(email);
        if (optional.isEmpty()) {
            return "Email không tồn tại.";
        }
        Account account = optional.get();
        if (Boolean.TRUE.equals(account.getIsVerified())) {
            return "Tài khoản đã được xác thực.";
        }
        String verificationCode = String.format("%06d", new java.util.Random().nextInt(999999));
        account.setVerificationToken(verificationCode);
        account.setVerificationTokenExpiry(java.time.LocalDateTime.now().plusHours(24));
        accountRepo.save(account);
        emailService.sendVerificationEmail(account.getEmail(), account.getFullName(), verificationCode);
        return "Mã xác thực mới đã được gửi lại email.";
    }

    // --- RESET PASSWORD BY EMAIL LINK ---
    @Override
    public String forgotPassword(String email) throws CustomerException {
        Account account = accountRepo.findByEmail(email)
                .orElseThrow(() -> new CustomerException("Email không tồn tại trong hệ thống."));
        String token = UUID.randomUUID().toString().replace("-", "");
        account.setResetPasswordToken(token);
        account.setResetPasswordTokenExpiry(LocalDateTime.now().plusMinutes(15));
        accountRepo.save(account);
        String resetLink = "http://localhost:3001/reset-password?token=" + token;
        emailService.sendPasswordResetLinkEmail(account.getEmail(), account.getFullName(), resetLink);
        return "Đã gửi link đặt lại mật khẩu về email. Vui lòng kiểm tra hộp thư.";
    }

    @Override
    public String resetPassword(String token, String newPassword) throws CustomerException {
        Account account = accountRepo.findByResetPasswordToken(token)
                .orElseThrow(() -> new CustomerException("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."));
        if (account.getResetPasswordTokenExpiry() == null || account.getResetPasswordTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new CustomerException("Link đặt lại mật khẩu đã hết hạn. Vui lòng gửi lại yêu cầu.");
        }
        if (encoder.matches(newPassword, account.getPassword())) {
            throw new CustomerException("Mật khẩu mới không được trùng với mật khẩu cũ.");
        }
        account.setPassword(encoder.encode(newPassword));
        account.setResetPasswordToken(null);
        account.setResetPasswordTokenExpiry(null);
        accountRepo.save(account);
        return "Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.";
    }

}
