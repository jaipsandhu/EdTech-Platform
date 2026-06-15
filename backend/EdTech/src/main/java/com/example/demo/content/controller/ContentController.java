package com.example.demo.content.controller;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.service.ContentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/content")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;


    @GetMapping
    public List<ContentResponseDTO> getAllContent() {

        return contentService.getAllContent();
    }


    @GetMapping("/active")
    public List<ContentResponseDTO> getActiveContent() {

        return contentService.getActiveContent();
    }


    @PutMapping("/activate/{id}")
    public void activateContent(
            @PathVariable Long id
    ) {

        contentService.activate(id);
    }


    @PutMapping("/deactivate/{id}")
    public void deactivateContent(
            @PathVariable Long id
    ) {

        contentService.deactivate(id);
    }



    @DeleteMapping("/{id}")
    public void deleteContent(
            @PathVariable Long id
    ) {

        contentService.deleteContent(id);
    }
}