package com.example.projectschedulehaircutserver.filter;

import com.example.projectschedulehaircutserver.exeption.AuthenticationException;
import com.example.projectschedulehaircutserver.service.jwt.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            final String userEmail = jwtService.extractUsername(jwt);

            if (userEmail == null) {
                throw new AuthenticationException("Token không chứa thông tin người dùng");
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.validateToken(jwt, userDetails)) {
                    System.out.println("User roles: " + userDetails.getAuthorities());
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }

            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            handleException(response, "Token đã hết hạn", e);
        } catch (MalformedJwtException e) {
            handleException(response, "Token không đúng định dạng", e);
        } catch (AuthenticationException e) {
            handleException(response, e.getMessage(), e);
        } catch (Exception e) {
            handleException(response, "Lỗi xác thực không xác định", e);
        }
    }

    private void handleException(HttpServletResponse response, String message, Exception e) throws IOException {
        SecurityContextHolder.clearContext();
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(String.format(
                "{\"error\":\"Lỗi xác thực\",\"message\":\"%s\"}",
                message
        ));
    }
}
