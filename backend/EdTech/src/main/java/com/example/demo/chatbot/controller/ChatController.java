package com.example.demo.chatbot.controller;

import com.example.demo.chatbot.service.ChatOrchestrationService;
import com.example.demo.chatbot.service.RagService;
import org.springframework.core.io.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.IOException;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final ChatOrchestrationService chatOrchestrationService;
    private final RagService ragService;

    public ChatController(ChatOrchestrationService chatOrchestrationService, RagService ragService) {
        this.chatOrchestrationService = chatOrchestrationService;
        this.ragService = ragService;
    }

    @GetMapping
    public Flux<String> rag(@RequestParam(defaultValue = "Hello") String message) {
        return chatOrchestrationService.chat(message);
    }

    @PostMapping("/load")
    public Flux<String> load(@RequestParam(defaultValue = "What is the content of the document?") String message,
                             @RequestParam(value = "file", required = false) MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            log.info("File is empty");
            return chatOrchestrationService.chat(message);
        }

        log.info("Saving document ...");
        Resource resource = ragService.saveDocument(file);
        log.info("Document saved");

        log.info("Saving segments ...");
        ragService.saveSegments(resource);
        log.info("Segments saved");

        return chatOrchestrationService.chat(message);
    }
}