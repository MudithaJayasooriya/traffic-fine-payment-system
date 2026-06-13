package com.traffic.demo.config;

import com.traffic.demo.security.JwtAuthenticationFilter;
import com.traffic.demo.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for stateless REST APIs
                .csrf(csrf -> csrf.disable())

                // Make session management stateless (Crucial for JWT)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Refined URL authorization rules to enforce roles properly
                .authorizeHttpRequests(auth -> auth
                        // 1. Explicitly allow public authentication routes
                        .requestMatchers("/auth/register", "/auth/login").permitAll()

                        // 2. Protect ALL Admin endpoints to require ADMIN role
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 3. All other requests must be authenticated
                .requestMatchers("/login", "/register", "/auth/**").permitAll()
                        .anyRequest().authenticated()
                )

                // Wire up the authentication provider linking DB access and BCrypt hashing
                .authenticationProvider(authenticationProvider())

                // Process the incoming custom JWT filter prior to the standard filter
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Links your custom user loading logic and BCrypt hashing together
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Required by your AuthService to process username/password validation checks during login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}