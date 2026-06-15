package com.example.demo.content.service;

import com.example.demo.content.dto.ContentResponseDTO;
import com.example.demo.content.dto.ContentUploadDTO;

import com.example.demo.content.entity.Content;

import com.example.demo.content.repository.ContentRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContentService {

    private final ContentRepository contentRepository;

    private final S3Service s3Service;


    public void uploadContent(

            MultipartFile file,

            ContentUploadDTO dto

    ) throws IOException {

      String fileUrl =
                s3Service.uploadFile(file);


        Content content =
                new Content();


        content.setTitle(
                dto.getTitle()
        );

        content.setSubject(
                dto.getSubject()
        );

        content.setDescription(
                dto.getDescription()
        );

        content.setContentType(
                dto.getContentType()
        );

        content.setFileUrl(fileUrl);


        content.setActive(true);

        Authentication authentication =

                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email =
                authentication.getName();

        content.setUploadedBy(email);


        contentRepository.save(content);
    }


    public List<ContentResponseDTO> getAllContent() {

        List<Content> contentList =
                contentRepository.findAll();

        List<ContentResponseDTO> dtoList =
                new ArrayList<>();

        for(Content content : contentList) {

            ContentResponseDTO dto =
                    new ContentResponseDTO();

            dto.setId(content.getId());

            dto.setUploadedBy(
                    content.getUploadedBy()
            );

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

            dto.setUploadedBy(
                    content.getUploadedBy()
            );

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