package com.sahriar.controller;

import com.sahriar.model.PipelineStage;
import com.sahriar.repository.PipelineStageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pipeline")
public class PipelineController {

    @Autowired
    private PipelineStageRepository pipelineStageRepository;

    @GetMapping
    public List<PipelineStage> getAllStages() {
        return pipelineStageRepository.findAllByOrderByStageOrderAsc();
    }

    @PostMapping
    public PipelineStage createStage(@RequestBody PipelineStage stage) {
        return pipelineStageRepository.save(stage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStage(@PathVariable Long id) {
        pipelineStageRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
