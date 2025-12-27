package com.sahriar.controller;

import com.sahriar.model.Interview;
import com.sahriar.repository.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    @Autowired
    private InterviewRepository interviewRepository;

    @GetMapping
    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    @PostMapping
    public Interview scheduleInterview(@RequestBody Interview interview) {
        return interviewRepository.save(interview);
    }

    @PutMapping("/{id}/feedback")
    public ResponseEntity<Interview> addFeedback(@PathVariable Long id, @RequestBody Interview feedbackDetails) {
        return interviewRepository.findById(id)
                .map(interview -> {
                    interview.setFeedback(feedbackDetails.getFeedback());
                    interview.setScore(feedbackDetails.getScore());
                    return ResponseEntity.ok(interviewRepository.save(interview));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
