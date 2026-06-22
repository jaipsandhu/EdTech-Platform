package com.example.demo.student.controller;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.service.ContentService;

import com.example.demo.notes.dto.CreateNotes;
import com.example.demo.notes.entity.Notes;
import com.example.demo.notes.service.NotesService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/student")
public class StudentController {


    private final ContentService contentService;

    private final NotesService notesService;


    @GetMapping
    public List<ContentResponseDTO> getContent() {

        return contentService.getActiveContent();
    }

    @GetMapping("/content/{id}")
    public ContentResponseDTO getContentById(
            @PathVariable Long id
    ) {

        return contentService
                .getContentById(id);
    }


    @PostMapping("/notes")
    public void createNote(
            @RequestBody CreateNotes dto
    ) {

        notesService.createNote(dto);
    }


    @GetMapping("/notes/{contentId}")
    public List<Notes> getNotes(
            @PathVariable Long contentId
    ) {

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        return notesService.getNotes(
                contentId,
                email
        );
    }


    @PutMapping("/notes/{id}")
    public void editNote(

            @PathVariable Long id,

            @RequestBody CreateNotes dto

    ) {

        notesService.editNote(
                id,
                dto
        );
    }


    @DeleteMapping("/notes/{id}")
    public void deleteNote(
            @PathVariable Long id
    ) {

        notesService.deleteNote(id);
    }






}