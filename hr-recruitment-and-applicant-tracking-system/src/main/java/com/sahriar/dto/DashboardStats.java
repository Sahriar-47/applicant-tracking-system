package com.sahriar.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class DashboardStats {
    private long totalCandidates;
    private long activeJobs;
    private long totalApplications;
    private long upcomingInterviews;
}
