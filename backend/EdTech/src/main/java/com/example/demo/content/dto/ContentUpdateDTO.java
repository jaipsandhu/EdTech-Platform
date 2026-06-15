package com.example.demo.content.dto;

import com.example.demo.content.entity.ContentType;

import lombok.Getter;
import lombok.Setter;


//unused for now ...


@Getter
@Setter
public class ContentUpdateDTO {

    private String title;

    private String subject;

    private String description;

    private ContentType contentType;

    private boolean active;
}