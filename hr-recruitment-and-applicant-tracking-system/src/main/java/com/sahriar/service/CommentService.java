package com.sahriar.service;

import com.sahriar.model.Comment;
import com.sahriar.model.Job;
import com.sahriar.model.User;
import com.sahriar.repository.CommentRepository;
import com.sahriar.repository.JobRepository;
import com.sahriar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment addComment(@org.springframework.lang.NonNull Long jobId, String username, String text) {

        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setJob(job);
        comment.setUser(user);
        comment.setText(text);

        return commentRepository.save(comment);
    }

    public Comment addReply(Long parentId, String username, String text) {
        Comment parent = commentRepository.findById(parentId)
                .orElseThrow(() -> new RuntimeException("Parent comment not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment reply = new Comment();
        reply.setJob(parent.getJob()); // Link to same job
        reply.setUser(user);
        reply.setText(text);
        reply.setParent(parent);

        return commentRepository.save(reply);
    }

    public List<Comment> getCommentsByJob(Long jobId) {
        return commentRepository.findByJobIdAndParentIsNullOrderByCreatedAtDesc(jobId);
    }

    public void deleteComment(@org.springframework.lang.NonNull Long commentId, String username) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        // Allow deletion if user owns the comment OR is an ADMIN
        if (comment.getUser().getUsername().equals(username) || "ROLE_ADMIN".equals(user.getRole())) {
            commentRepository.delete(comment);
        } else {
            throw new RuntimeException("Unauthorized to delete this comment");
        }
    }
}
