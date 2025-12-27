package com.sahriar.dto;

import lombok.Data;

@Data
public class ApplicationRequest {
    private Long jobId;
    private Long candidateId; // Logic might extract this from auth token usually, but keeping for now
    private String resumeUrl;
    private String coverLetter;
    private String phone;
}
