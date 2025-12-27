package com.sahriar.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Interview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @ManyToOne
    @JoinColumn(name = "interviewer_id")
    private User interviewer;

    private LocalDateTime scheduledTime;
    private String location;
    private String feedback;
    private Integer score; // 1-10
}
