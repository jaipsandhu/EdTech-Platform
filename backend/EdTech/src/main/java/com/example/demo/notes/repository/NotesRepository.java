package com.example.demo.notes.repository;

import com.example.demo.notes.entity.Notes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotesRepository extends JpaRepository<Notes, Long> {
    List<Notes> findByContentIdAndEmail(
            Long contentId, String email
    );

    List<Notes> findByContentId(
            Long contentId
    );
}
