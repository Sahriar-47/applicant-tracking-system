package com.sahriar.controller;

import com.sahriar.model.Comment;
import com.sahriar.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/job/{jobId}")
    public ResponseEntity<?> addComment(
            @PathVariable Long jobId,
            @RequestBody Map<String, String> payload,
            Principal principal) {
        try {
            if (jobId == null) {
                return ResponseEntity.badRequest().body("Job ID cannot be null");
            }

            String text = payload.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Comment text cannot be empty");
            }

            Comment comment = commentService.addComment(jobId, principal.getName(), text);
            return ResponseEntity.ok(comment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{commentId}/reply")
    public ResponseEntity<?> addReply(@PathVariable Long commentId, @RequestBody Map<String, String> payload,
            Principal principal) {
        try {
            String text = payload.get("text");
            if (text == null || text.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Reply text cannot be empty");
            }
            Comment reply = commentService.addReply(commentId, principal.getName(), text);
            return ResponseEntity.ok(reply);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long jobId) {
        return ResponseEntity.ok(commentService.getCommentsByJob(jobId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Principal principal) {
        commentService.deleteComment(commentId, principal.getName());
        return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
    }
}
