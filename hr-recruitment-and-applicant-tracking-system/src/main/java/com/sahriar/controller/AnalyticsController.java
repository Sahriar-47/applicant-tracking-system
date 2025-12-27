package com.sahriar.controller;

import com.sahriar.dto.DashboardStats;
import com.sahriar.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public DashboardStats getDashboardStats() {
        return analyticsService.getDashboardStats();
    }
}
