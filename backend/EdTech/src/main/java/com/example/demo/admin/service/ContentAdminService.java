package com.example.demo.admin.service;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.entity.Content;
import com.example.demo.content.repository.ContentRepository;
import com.example.demo.content.service.S3Service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@RequiredArgsConstructor
@Service
public class ContentAdminService {

    private final ContentRepository contentRepository;

    private final S3Service s3Service;

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


    public void activateContent(Long id) {

        Content content =
                contentRepository
                        .findById(id)
                        .orElseThrow();

        content.setActive(true);

        contentRepository.save(content);
    }


    public void deactivateContent(Long id) {

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


        String fileUrl =
                content.getFileUrl();

        String fileName =
                fileUrl.substring(
                        fileUrl.lastIndexOf("/") + 1
                );

        s3Service.deleteFile(fileName);

        contentRepository.delete(content);
    }
}