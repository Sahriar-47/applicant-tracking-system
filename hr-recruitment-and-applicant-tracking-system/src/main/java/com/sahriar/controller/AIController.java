package com.sahriar.controller;

import com.sahriar.service.GeminiService;
import com.sahriar.service.ResumeParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private ResumeParserService resumeParserService;

    @PostMapping("/analyze")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Map<String, String>> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            String resumeText = resumeParserService.parseResume(file);
            String analysis = geminiService.analyzeResume(resumeText);

            Map<String, String> response = new HashMap<>();
            response.put("text", resumeText); // Send back text for context in chat
            response.put("analysis", analysis);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            String errorMessage = e.getMessage() != null ? e.getMessage() : "Unknown error processing request";
            return ResponseEntity.internalServerError().body(Map.of("error", errorMessage));
        }
    }

    @PostMapping("/chat")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String context = payload.get("context");

        if (message == null || context == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message and context are required"));
        }

        String reply = geminiService.chat(message, context);
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}
