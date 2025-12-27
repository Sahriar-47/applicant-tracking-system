package com.sahriar.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank(message = "Title is required")
    private String title;

    @jakarta.validation.constraints.NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @jakarta.validation.constraints.NotBlank(message = "Location is required")
    private String location;
    private String department;
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;
}
