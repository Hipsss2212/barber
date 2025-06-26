package com.example.projectschedulehaircutserver.filter;

import com.example.projectschedulehaircutserver.exeption.AuthenticationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && !(authentication instanceof AnonymousAuthenticationToken)) {
                String path = request.getServletPath();

                if (path.startsWith("/employee")) {
                    if (authentication.getAuthorities().stream()
                            .noneMatch(a -> a.getAuthority().equals("ROLE_EMPLOYEE") ||
                                    a.getAuthority().equals("ROLE_ADMIN"))) {
                        throw new AccessDeniedException("Access Denied for EMPLOYEE area");
                    }
                }
                else if (path.startsWith("/admin")) {
                    if (authentication.getAuthorities().stream()
                            .noneMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                        throw new AccessDeniedException("Access Denied for ADMIN area");
                    }
                }
            }

            filterChain.doFilter(request, response);

        } catch (AccessDeniedException e) {
            SecurityContextHolder.clearContext();
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("{\"error\":\"" + e.getMessage() + "\"}");
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Authentication failed\"}");
        }
    }
}
