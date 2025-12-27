package com.sahriar.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ Correct API version + model (from your ListModels result)
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String analyzeResume(String resumeText) {
        String prompt = """
                Act as a specialized Career Advisor and Engineering Job Matcher.

                Analyze the following resume text and suggest the best engineering roles suitable for this candidate.
                For each role, provide:
                - Role Name
                - Match Reasoning
                - Skill Gaps

                Resume Text:
                %s
                """.formatted(resumeText);

        return callGeminiApi(prompt);
    }

    public String chat(String message, String context) {
        String prompt = """
                Context: You are analyzing a resume and giving career advice.

                Resume Context:
                %s

                User Question:
                %s
                """.formatted(context, message);

        return callGeminiApi(prompt);
    }

    @SuppressWarnings("unchecked")
    private String callGeminiApi(String text) {
        String url = GEMINI_API_URL + apiKey;

        // ✅ Gemini 2.5 Pro–compatible request body
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", text)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "topP", 0.95,
                        "maxOutputTokens", 2048));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map<String, Object> body = response.getBody();
            if (body == null) {
                return "Empty response from AI.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "No candidates returned from AI.";
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");

            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            if (parts == null || parts.isEmpty()) {
                return "No response text from AI.";
            }

            return parts.get(0).get("text").toString();

        } catch (Exception e) {
            return "Error communicating with AI service: " + e.getMessage();
        }
    }
}
