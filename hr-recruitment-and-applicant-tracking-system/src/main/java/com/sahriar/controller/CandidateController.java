package com.sahriar.controller;

import com.sahriar.model.Candidate;
import com.sahriar.repository.CandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.sahriar.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private ResumeParserService resumeParserService;

    @PostMapping("/parse-resume")
    public ResponseEntity<String> parseResume(@RequestParam("file") MultipartFile file) {
        try {
            String content = resumeParserService.parseResume(file);
            return ResponseEntity.ok(content);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error parsing resume: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Candidate> getAllCandidates() {
        return candidateRepository.findAll();
    }

    @PostMapping
    public Candidate createCandidate(@jakarta.validation.Valid @RequestBody Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidateById(@PathVariable Long id) {
        return candidateRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
