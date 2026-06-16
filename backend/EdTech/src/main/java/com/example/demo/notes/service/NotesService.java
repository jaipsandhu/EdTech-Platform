package com.example.demo.notes.service;

import com.example.demo.notes.dto.CreateNotes;
import com.example.demo.notes.entity.Notes;
import com.example.demo.notes.repository.NotesRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class NotesService {

    private final NotesRepository notesRepository;


    public void createNote(
            CreateNotes dto
    ) {

        Notes note =
                new Notes();

        note.setTitle(
                dto.getTitle()
        );

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        note.setEmail(email);

        note.setContent(
                dto.getContent()
        );

        note.setContentId(
                dto.getContentId()
        );

        notesRepository.save(note);
    }


    public List<Notes> getNotes(
            Long contentId,
            String email
    ) {

        return notesRepository
                .findByContentId(contentId);
    }


    public void editNote(
            Long id,
            CreateNotes dto
    ) {

        Notes note =
                notesRepository
                        .findById(id)
                        .orElseThrow();

        note.setTitle(
                dto.getTitle()
        );

        note.setContent(
                dto.getContent()
        );

        notesRepository.save(note);
    }


    public void deleteNote(
            Long id
    ) {

        notesRepository.deleteById(id);
    }
}