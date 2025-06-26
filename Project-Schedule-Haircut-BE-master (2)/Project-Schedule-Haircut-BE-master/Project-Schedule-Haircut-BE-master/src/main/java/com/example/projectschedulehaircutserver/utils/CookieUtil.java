package com.example.projectschedulehaircutserver.utils;

import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {
    @Value("${jwt.expiration_access_token}")
    private long expirationAccessToken;

    @Value("${jwt.expiration_refresh_token}")
    private long expirationRefreshToken;

    @Value("${app.environment:prod}")
    private String environment;

    public Cookie createSecureCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setMaxAge(maxAge);
        cookie.setPath("/");

        boolean isDev = "dev".equals(environment);
        cookie.setHttpOnly(!isDev);
        cookie.setSecure(!isDev);

        if (isDev) {
            cookie.setAttribute("SameSite", "Lax");
        }

        return cookie;
    }

    public void generatorTokenCookie(HttpServletResponse response, AuthenticationResponse authResponse) {
        if (authResponse == null) {
            throw new IllegalArgumentException("AuthenticationResponse cannot be null");
        }

        // Chuyển đổi milliseconds sang seconds
        int accessTokenAge = (int)(expirationAccessToken / 1000);
        int refreshTokenAge = (int)(expirationRefreshToken / 1000);

        // Tạo cookies
        Cookie accessTokenCookie = createSecureCookie("accessToken",
                authResponse.getToken(),
                authResponse.getToken() != null ? accessTokenAge : 0);

        Cookie refreshTokenCookie = createSecureCookie("refreshToken",
                authResponse.getRefreshToken(),
                authResponse.getRefreshToken() != null ? refreshTokenAge : 0);

        Cookie usernameCookie = createSecureCookie("username",
                authResponse.getUsername(),
                authResponse.getUsername() != null ? accessTokenAge : 0);

        Cookie roleCookie = createSecureCookie("role",
                authResponse.getRole(),
                authResponse.getRole() != null ? accessTokenAge : 0);

        // Thêm cookies vào response
        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
        response.addCookie(usernameCookie);
        response.addCookie(roleCookie);
    }

    public void saveAccessTokenCookie(HttpServletResponse response, AuthenticationResponse authResponse) {
        int accessTokenAge = (int)(expirationAccessToken / 1000);
        int refreshTokenAge = (int)(expirationRefreshToken / 1000);

        Cookie accessTokenCookie = createSecureCookie("accessToken",
                authResponse.getToken(),
                accessTokenAge);

        Cookie refreshTokenCookie = createSecureCookie("refreshToken",
                authResponse.getRefreshToken(),
                refreshTokenAge);

        Cookie usernameCookie = createSecureCookie("username",
                authResponse.getUsername(),
                accessTokenAge);

        Cookie roleCookie = createSecureCookie("role",
                authResponse.getRole(),
                accessTokenAge);

        response.addCookie(accessTokenCookie);
        response.addCookie(refreshTokenCookie);
        response.addCookie(usernameCookie);
        response.addCookie(roleCookie);
    }

    public void removeCookies(HttpServletResponse response) {
        String[] cookieNames = {"accessToken", "refreshToken", "username", "role"};

        for (String name : cookieNames) {
            Cookie cookie = new Cookie(name, "");
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
        }
    }
}
