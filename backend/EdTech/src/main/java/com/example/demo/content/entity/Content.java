package com.example.demo.content.entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Content {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String title;

    private String subject;

    private String description;


    private String fileUrl;

    private String s3Key;



    @Enumerated(EnumType.STRING)
    private ContentType contentType;

    private String uploadedBy;

    private boolean active = true;

    private LocalDateTime createdAt =
            LocalDateTime.now();
}