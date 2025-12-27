package com.sahriar.controller;

import com.sahriar.model.Application;
import com.sahriar.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private com.sahriar.repository.UserRepository userRepository;

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Application> apply(@RequestBody com.sahriar.dto.ApplicationRequest request) {
        // In real app, verify candidateId matches logged in user or extract from token
        // For now trusting the ID passed from frontend (secured by role check at least)
        return ResponseEntity.ok(applicationService.applyForJob(
                request.getCandidateId(),
                request.getJobId(),
                request.getResumeUrl(),
                request.getCoverLetter(),
                request.getPhone()));
    }

    @GetMapping("/job/{jobId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public List<Application> getByJob(@PathVariable Long jobId) {
        return applicationService.getApplicationsByJob(jobId);
    }

    @GetMapping("/candidate/{candidateId}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('CANDIDATE', 'ADMIN')")
    public List<Application> getByCandidate(@PathVariable Long candidateId) {
        return applicationService.getApplicationsByCandidate(candidateId);
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/my-jobs")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('RECRUITER')")
    public List<Application> getRecruiterApplications() {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        Long recruiterId = userRepository.findByUsername(username).get().getId();
        return applicationService.getApplicationsByRecruiter(recruiterId);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'RECRUITER')")
    public ResponseEntity<?> deleteApplication(@PathVariable Long id) {
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        boolean isAdmin = org.springframework.security.core.authority.AuthorityUtils.authorityListToSet(
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication()
                        .getAuthorities())
                .contains("ROLE_ADMIN");

        if (isAdmin) {
            applicationService.deleteApplication(id);
            return ResponseEntity.ok().build();
        }

        // Check ownership
        Application app = applicationService.getApplicationById(id);
        if (app.getJob().getRecruiter().getUsername().equals(username)) {
            applicationService.deleteApplication(id);
            return ResponseEntity.ok().build();
        }

        return ResponseEntity.status(403).body("You are not authorized to delete this application.");
    }
}
