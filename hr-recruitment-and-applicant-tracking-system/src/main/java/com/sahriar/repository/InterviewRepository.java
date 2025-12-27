package com.sahriar.repository;

import com.sahriar.model.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);

    List<Interview> findByInterviewerId(Long interviewerId);
}
