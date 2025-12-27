package com.sahriar.repository;

import com.sahriar.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByJobIdAndParentIsNullOrderByCreatedAtDesc(Long jobId);
}
