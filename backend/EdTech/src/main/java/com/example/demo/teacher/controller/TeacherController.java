package com.example.demo.teacher.controller;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.dto.ContentUploadDTO;
import com.example.demo.content.entity.ContentType;
import com.example.demo.content.service.ContentService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/teacher")
public class TeacherController {

    private final ContentService contentService;



    @GetMapping
    public List<ContentResponseDTO> getAllContent() {

        return contentService.getAllContent();
    }



    @PostMapping("/upload")
    public void uploadContent(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("title")
            String title,

            @RequestParam("subject")
            String subject,

            @RequestParam("description")
            String description,

            @RequestParam("contentType")
            String contentType

    ) throws IOException {

        ContentUploadDTO dto =
                new ContentUploadDTO();

        dto.setTitle(title);

        dto.setSubject(subject);

        dto.setDescription(description);

        dto.setContentType(
                ContentType.valueOf(contentType)
        );

        contentService.uploadContent(
                file,
                dto
        );
    }


    @DeleteMapping("/{id}")
    public void deleteContent(
            @PathVariable Long id
    ) {

        contentService.deleteContent(id);
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
}