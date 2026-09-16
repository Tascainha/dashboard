package com.dashboard.finance.service;

import com.dashboard.finance.dto.auth.AuthResponse;
import com.dashboard.finance.dto.auth.LoginRequest;
import com.dashboard.finance.dto.auth.RegisterRequest;
import com.dashboard.finance.entity.User;
import com.dashboard.finance.exception.BadRequestException;
import com.dashboard.finance.repository.UserRepository;
import com.dashboard.finance.security.JwtService;
import com.dashboard.finance.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .build();
        user = userRepository.save(user);

        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtService.generateToken(principal);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail());
    }
}
