package com.example.demo.notes.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CreateNotes {

    private String title;

    private String email;

    private String content;

    private Long contentId;


}
