package com.sahriar.service;

import com.sahriar.model.User;
import com.sahriar.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

        private final UserRepository userRepository;

        public MyUserDetailsService(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String username)
                throws UsernameNotFoundException {

                User user = userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException("User not found: " + username)
                        );

                String role = normalizeRole(user.getRole());

                return new org.springframework.security.core.userdetails.User(
                        user.getUsername(),
                        user.getPassword(),
                        List.of(new SimpleGrantedAuthority(role))
                );
        }

        /**
         * Ensures role follows Spring Security standard: ROLE_XXX
         */
        private String normalizeRole(String role) {

                if (role == null || role.isBlank()) {
                        return "ROLE_CANDIDATE";
                }

                return role.startsWith("ROLE_") ? role : "ROLE_" + role;
        }
}
