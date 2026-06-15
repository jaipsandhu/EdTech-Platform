package com.example.demo.admin.controller;


import com.example.demo.admin.dto.EditUserDTO;
import com.example.demo.admin.dto.UserListDTO;
import com.example.demo.admin.service.StudentAdminService;
import com.example.demo.admin.service.TeacherAdminService;
import com.example.demo.content.entity.ContentType;
import com.example.demo.content.service.ContentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.example.demo.admin.service.ContentAdminService;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.dto.ContentUploadDTO;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final StudentAdminService studentAdminService;
    private final TeacherAdminService teacherAdminService;
    private final ContentService contentService;

    @GetMapping("/students")
    public List<UserListDTO> getStudents(){
        return studentAdminService.getStudents();
    }


    @DeleteMapping("/students/{id}")
    public void deleteStudent(
            @PathVariable Long id
    ) {

        studentAdminService.deleteStudent(id);

    }

    @PutMapping("/students/{id}")
    public void editStudent(
            @PathVariable Long id,
            @RequestBody EditUserDTO dto
    ) {

        studentAdminService.editStudent(id, dto);

    }

    @GetMapping("/teachers")
    public List<UserListDTO> getTeachers() {

        return teacherAdminService.getTeachers();

    }


    @DeleteMapping("/teachers/{id}")
    public void deleteTeacher(
            @PathVariable Long id
    ) {

        teacherAdminService.deleteTeacher(id);

    }

    @PutMapping("/teachers/{id}")
    public void editTeacher(
            @PathVariable Long id,
            @RequestBody EditUserDTO dto
    ) {

        teacherAdminService.editTeacher(id, dto);

    }


    @GetMapping("/content")
    public List<ContentResponseDTO> getAllContent() {

        return contentService.getAllContent();
    }


    @PostMapping("/content/upload")
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

    @DeleteMapping("/content/{id}")
    public void deleteContent(
            @PathVariable Long id
    ) {

        contentService.deleteContent(id);
    }


    @PutMapping("/content/activate/{id}")
    public void activateContent(
            @PathVariable Long id
    ) {

        contentService.activate(id);
    }


    @PutMapping("/content/deactivate/{id}")
    public void deactivateContent(
            @PathVariable Long id
    ) {

        contentService.deactivate(id);
    }
    



}
