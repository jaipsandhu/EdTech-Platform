package com.example.demo.chatbot.service;

import dev.langchain4j.rag.content.Content;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.rag.query.Query;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;


import java.util.List;
import java.util.Set;

@Service
public class ChatOrchestrationService {

    private final AiChatService aiChatService;
    private final EmbeddingStoreContentRetriever contentRetriever;

    private static final Set<String> GREETINGS = Set.of(
            "hi", "hello", "hey", "yo", "sup", "good morning", "good evening"
    );

    public ChatOrchestrationService(AiChatService aiChatService,
                                    EmbeddingStoreContentRetriever contentRetriever) {
        this.aiChatService = aiChatService;
        this.contentRetriever = contentRetriever;
    }

    public Flux<String> chat(String message) {

        String normalized = message.trim().toLowerCase();
        if (GREETINGS.contains(normalized)) {
            return aiChatService.chat(message);
        }

        List<Content> retrieved = contentRetriever.retrieve(Query.from(message));

        if (retrieved == null || retrieved.isEmpty()) {
            return Flux.just("This topic isn't covered in your course materials. Please refer to your teacher or additional resources.");
        }

        return aiChatService.chat(message);
    }
}