package com.example.demo.chatbot.controller;


import com.example.demo.chatbot.service.AiChatService;
import com.example.demo.chatbot.service.RagService;
import org.springframework.core.io.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;
import dev.langchain4j.data.document.Document;

import java.io.IOException;

@RestController
    @RequestMapping("/chat")
    @CrossOrigin(origins = "*")
    public class ChatController {
        private static final Logger log = LoggerFactory.getLogger(ChatController.class);
        private final AiChatService chatService;
        private final RagService ragService;

        public ChatController(AiChatService chatService, RagService ragService) {
            this.chatService = chatService;
            this.ragService = ragService;
        }

        @GetMapping
        public Flux<String> rag(@RequestParam(defaultValue = "Hello") String message) {
            // Simple chat endpoint:
            // - Handles basic questions without document context
            // - Returns streaming response
            return chatService.chat(message);
        }

        @PostMapping("/load")
        public Flux<String> load(@RequestParam(defaultValue = "What is the content of the document?") String message,
                                 @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {
            // Document-aware chat endpoint:
            // 1. Check if file is provided
            if(file == null || file.isEmpty()) {
                log.info("File is empty");
                return chatService.chat(message);
            }


            // 2. Process uploaded document
            log.info("Saving document ...");
            Resource resource = ragService.saveDocument(file);
            log.info("Document saved");

            // 3. Extract and store document segments
            log.info("Saving segments ...");
            ragService.saveSegments(resource);
            log.info("Segments saved");

            // 4. Generate response using document context
            return chatService.chat(message);
        }
    }

