package com.example.demo.content.dto;

import com.example.demo.content.entity.ContentType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContentResponseDTO {

    private Long id;

    private String title;

    private String fileUrl;

    private ContentType contentType;

    private boolean active;
}