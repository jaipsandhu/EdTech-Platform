package com.example.demo.content.service;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.entity.Content;
import com.example.demo.content.repository.ContentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;

    public List<ContentResponseDTO> getAllContent() {

        List<Content> contentList =
                contentRepository.findAll();

        List<ContentResponseDTO> dtoList =
                new ArrayList<>();

        for(Content content : contentList) {

            ContentResponseDTO dto =
                    new ContentResponseDTO();

            dto.setId(content.getId());

            dto.setTitle(content.getTitle());

            dto.setFileUrl(content.getFileUrl());

            dto.setContentType(
                    content.getContentType()
            );

            dto.setActive(
                    content.isActive()
            );

            dtoList.add(dto);
        }

        return dtoList;
    }



    public List<ContentResponseDTO> getActiveContent() {

        List<Content> contentList =
                contentRepository.findByActiveTrue();

        List<ContentResponseDTO> dtoList =
                new ArrayList<>();

        for(Content content : contentList) {

            ContentResponseDTO dto =
                    new ContentResponseDTO();

            dto.setId(content.getId());

            dto.setTitle(content.getTitle());

            dto.setFileUrl(content.getFileUrl());

            dto.setContentType(
                    content.getContentType()
            );

            dto.setActive(
                    content.isActive()
            );

            dtoList.add(dto);
        }

        return dtoList;
    }



    public void activate(Long id){

        Content content =
                contentRepository
                        .findById(id)
                        .orElseThrow();

        content.setActive(true);

        contentRepository.save(content);
    }


    public void deactivate(Long id){

        Content content =
                contentRepository
                        .findById(id)
                        .orElseThrow();

        content.setActive(false);

        contentRepository.save(content);
    }


    public void deleteContent(Long id) {

        Content content =
                contentRepository
                        .findById(id)
                        .orElseThrow();

        contentRepository.delete(content);
    }
}