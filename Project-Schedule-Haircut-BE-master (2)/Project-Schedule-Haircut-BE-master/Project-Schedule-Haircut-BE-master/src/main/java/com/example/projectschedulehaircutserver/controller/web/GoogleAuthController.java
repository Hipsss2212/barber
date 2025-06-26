package com.example.projectschedulehaircutserver.controller.web;

import com.example.projectschedulehaircutserver.entity.Account;
import com.example.projectschedulehaircutserver.repository.AccountRepo;
import com.example.projectschedulehaircutserver.response.AuthenticationResponse;
import com.example.projectschedulehaircutserver.service.jwt.JwtService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Autowired
    private AccountRepo accountRepo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String idTokenString = body.get("idToken");
        GoogleIdToken.Payload payload = verifyGoogleToken(idTokenString);
        if (payload == null) {
            return ResponseEntity.status(401).body("Invalid Google token");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String sub = payload.getSubject();

        Optional<Account> optionalAccount = accountRepo.findByEmail(email);
        Account account = optionalAccount.orElseGet(() -> {
            Account acc = new Account();
            acc.setEmail(email);
            acc.setFullName(name);
            acc.setProvider("GOOGLE");
            acc.setProviderId(sub);
            acc.setPassword(passwordEncoder.encode(sub)); // random password
            acc.setUserName(email.split("@")[0]);
            acc.setAvatar("https://i.postimg.cc/pVs3qTMy/image.png");
            acc.setIsBlocked(false);
            // TODO: set role, age, address, phone nếu cần
            return accountRepo.save(acc);
        });

        String jwt = jwtService.generateAccessToken(account);
        return ResponseEntity.ok(AuthenticationResponse.builder()
                .token(jwt)
                .username(account.getUsername())
                .role(account.getRole() != null ? account.getRole().getName() : "USER")
                .build());
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier
                    .Builder(GoogleNetHttpTransport.newTrustedTransport(), JacksonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList("819526080287-fdgs95mdmhq1k5r6vjna8nuv1c61link.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
} 