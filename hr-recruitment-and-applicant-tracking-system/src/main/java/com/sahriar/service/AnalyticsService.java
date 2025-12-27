package com.sahriar.service;

import com.sahriar.dto.DashboardStats;
import com.sahriar.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    public DashboardStats getDashboardStats() {
        long totalCandidates = candidateRepository.count();
        long activeJobs = jobRepository.count();
        long totalApplications = applicationRepository.count();
        long upcomingInterviews = interviewRepository.count(); // Simplified for demo, ideally filter by date

        return new DashboardStats(totalCandidates, activeJobs, totalApplications, upcomingInterviews);
    }
}
