package com.example.projectschedulehaircutserver.service.redis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final StringRedisTemplate redisTemplate;
    private final String otpPrefix;
    private final String otpCountPrefix;

    @Autowired
    public RedisService(StringRedisTemplate redisTemplate,
                        @Value("${app.redis.prefix.otp}") String otpPrefix,
                        @Value("${app.redis.prefix.otp-count}") String otpCountPrefix) {
        this.redisTemplate = redisTemplate;
        this.otpPrefix = otpPrefix;
        this.otpCountPrefix = otpCountPrefix;
    }

    // luu OTP vào Redis với TTL
    public void saveOTP(String email, String code, long ttlMinutes) {
        String key = otpPrefix + email;
        redisTemplate.opsForValue().set(key, code, ttlMinutes, TimeUnit.MINUTES);
    }

    // lấy OTP từ Redis
    public String getOTP(String email) {
        String key = otpPrefix + email;
        return redisTemplate.opsForValue().get(key);
    }

    // xóa OTP khỏi Redis
    public void deleteOTP(String email) {
        String key = otpPrefix + email;
        redisTemplate.delete(key);
    }

    // lấy số lần yêu cầu OTP từ Redis
    public long getOTPRequestCount(String email) {
        String key = otpCountPrefix + email;
        String count = redisTemplate.opsForValue().get(key);
        return count == null ? 0 : Long.parseLong(count);
    }

    // tăng số lần yêu cầu OTP
    public void incrementOTPRequestCount(String email) {
        String key = otpCountPrefix + email;
        redisTemplate.opsForValue().increment(key);
        redisTemplate.expire(key, 30, TimeUnit.MINUTES);
    }

    // xóa số lần yêu cầu OTP
    public void deleteOTPRequestCount(String email) {
        String key = otpCountPrefix + email;
        redisTemplate.delete(key);
    }
}

