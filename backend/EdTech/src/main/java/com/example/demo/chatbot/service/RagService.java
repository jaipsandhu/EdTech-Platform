package com.example.demo.chatbot.service;

import dev.langchain4j.data.document.BlankDocumentException;
import dev.langchain4j.data.document.Document;
import dev.langchain4j.data.document.loader.FileSystemDocumentLoader;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.UUID;

@Service
public class RagService {

    private static final long MAX_FILE_SIZE =
            3 * 1024 * 1024;

    private static final String UPLOAD_DIR =
            "src/main/resources/docs";

    private static final Logger log =
            LoggerFactory.getLogger(RagService.class);

    private final EmbeddingStoreIngestor embeddingStoreIngestor;

    private final EmbeddingStore<TextSegment> embeddingStore;

    public RagService(
            EmbeddingStoreIngestor embeddingStoreIngestor,
            EmbeddingStore<TextSegment> embeddingStore
    ) {

        this.embeddingStoreIngestor =
                embeddingStoreIngestor;

        this.embeddingStore =
                embeddingStore;
    }

    public void saveSegments(
            Resource resource
    ) throws IOException {

        log.info("Removing all segments ...");

//        embeddingStore.removeAll();

        try {

            log.info("Loading document ...");

            Document document =
                    FileSystemDocumentLoader.loadDocument(
                            resource.getFile().toPath()
                    );

            log.info("Ingesting document ...");

            embeddingStoreIngestor.ingest(document);

            log.info("Document ingested");

        } catch (BlankDocumentException e) {

            log.error("Document is empty");
        }
    }

    public Resource saveDocument(
            MultipartFile file
    ) {

        try {

            if (
                    file.getSize()
                            > MAX_FILE_SIZE
            ) {

                throw new IllegalArgumentException(
                        "File size must not exceed 3MB"
                );
            }

            File directory =
                    new File(UPLOAD_DIR);

            if (!directory.exists()) {

                directory.mkdirs();
            }

            String fileName =
                    UUID.randomUUID()
                            + "_"
                            + file.getOriginalFilename();

            Path filePath =
                    Paths.get(
                            UPLOAD_DIR,
                            fileName
                    );

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return new UrlResource(
                    filePath.toUri()
            );

        } catch (IOException e) {

            throw new RuntimeException(e);
        }
    }
}