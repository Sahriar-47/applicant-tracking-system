package com.sahriar.controller;

import com.sahriar.model.Job;
import com.sahriar.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private com.sahriar.repository.UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public Job createJob(@jakarta.validation.Valid @RequestBody Job job) {
        // Assign current user as recruiter
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        userRepository.findByUsername(username).ifPresent(job::setRecruiter);
        return jobRepository.save(job);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        boolean isAdmin = org.springframework.security.core.authority.AuthorityUtils.authorityListToSet(
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                        .getAuthorities())
                .contains("ROLE_ADMIN");

        Job job = jobRepository.findById(id).orElse(null);
        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        if (isAdmin || (job.getRecruiter() != null && job.getRecruiter().getUsername().equals(username))) {
            jobRepository.delete(job);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(403).body("You are not authorized to delete this job.");
    }
}
