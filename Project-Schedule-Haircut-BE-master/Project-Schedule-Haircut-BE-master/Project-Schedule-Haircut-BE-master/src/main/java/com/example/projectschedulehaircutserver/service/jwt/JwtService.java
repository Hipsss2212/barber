package com.example.projectschedulehaircutserver.service.jwt;

import com.example.projectschedulehaircutserver.entity.BlackList;
import com.example.projectschedulehaircutserver.entity.WhiteList;
import com.example.projectschedulehaircutserver.exeption.RefreshTokenException;
import com.example.projectschedulehaircutserver.repository.BlackListRepo;
import com.example.projectschedulehaircutserver.repository.WhiteListRepo;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secretKey}")
    private String secretKey;

    @Value("${jwt.expiration_access_token}")
    private long accessTokenExpiration;

    @Value("${jwt.expiration_refresh_token}")
    private long refreshTokenExpiration;

    private final BlackListRepo blackListRepo;
    private final WhiteListRepo whiteListRepo;
    private final UserDetailsService userDetailsService;

    // Lấy ra key từ secretKey
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Tạo access token
    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(userDetails, accessTokenExpiration);
    }

    // Tạo refresh token
    @Transactional
    public String generateAndSaveRefreshToken(UserDetails userDetails) {
        String refreshToken = buildToken(userDetails, refreshTokenExpiration);

        // Lưu refresh token vào whitelist
        WhiteList whiteListToken = WhiteList.builder()
                .token(refreshToken)
                .userId(userDetails.getUsername())
                .expirationToken(LocalDateTime.now().plusDays(30))
                .build();

        whiteListRepo.save(whiteListToken);
        return refreshToken;
    }

    // Tạo token từ userDetails
    private String buildToken(UserDetails userDetails, long expiration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Lấy ra username từ token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Lấy ra các claims từ token
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Lấy ra tất cả claims từ token
    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSignKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims(); // Vẫn trả về claims dù đã hết hạn
        }
    }

    // Kiểm tra token đã hết hạn hay chưa
    public boolean isTokenExpired(String token) {
        try {
            return extractClaim(token, Claims::getExpiration).before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    // Kiểm tra token có trong blacklist hay không
    public boolean isTokenInBlackList(String token) {
        return blackListRepo.findByToken(token).isPresent();
    }

    // Kiểm tra token có trong whitelist hay không
    public boolean isTokenInWhiteList(String username){
        return whiteListRepo.findByUserId(username).isPresent();
    }

    // tạo mới access token từ refresh token
    @Transactional
    public String generateNewAccessTokenFromRefreshToken(String refreshToken) throws RefreshTokenException {
        // 1. Kiểm tra blacklist
        if (isTokenInBlackList(refreshToken)) {
            throw new RefreshTokenException("Token đã bị thu hồi");
        }

        // 2. Kiểm tra whitelist
        WhiteList whiteListToken = whiteListRepo.findByToken(refreshToken)
                .orElseThrow(() -> new RefreshTokenException("Token không hợp lệ"));

        // 3. Kiểm tra expiration
        if (whiteListToken.getExpirationToken().isBefore(LocalDateTime.now())) {
            revokeRefreshToken(refreshToken);
            throw new RefreshTokenException("Token đã hết hạn");
        }

        // 4. Tạo access token mới
        String username = extractUsername(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        return generateAccessToken(userDetails);
    }

    // Thu hồi refresh token
    @Transactional
    public void revokeRefreshToken(String refreshToken) {
        Optional<WhiteList> whiteListToken = whiteListRepo.findByToken(refreshToken);

        if (whiteListToken.isPresent()) {
            blackListRepo.save(new BlackList(refreshToken));

            whiteListRepo.deleteByToken(whiteListToken.get().getToken());
        }
    }

    // Kiểm tra token có hợp lệ hay không
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername())
                    && !isTokenExpired(token)
                    && !isTokenInBlackList(token);
        } catch (JwtException e) {
            return false;
        }
    }

    // clear token trong blacklist
    @Scheduled(cron = "0 0 0 * * ?") // 0h00 mỗi ngày
    @Transactional
    public void cleanExpiredBlacklistTokens() {
        LocalDateTime now = LocalDateTime.now();
        blackListRepo.deleteByCreatedAtBefore(now.minusDays(1));
        System.out.println("Đã dọn dẹp Blacklist vào lúc " + now);
    }

    // clear token trong whitelist
    @Scheduled(cron = "0 0 0 1 */1 ?") // 0h00 ngày đầu tiên mỗi tháng
    @Transactional
    public void cleanExpiredWhitelistTokens() {
        LocalDateTime now = LocalDateTime.now();
        whiteListRepo.deleteByExpirationTokenBefore(now.minusDays(30)); // Xóa các token hết hạn >30 ngày
        System.out.println("Đã dọn dẹp Whitelist vào lúc " + now);
    }
}