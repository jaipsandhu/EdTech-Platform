package com.example.demo.chatbot.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;
import reactor.core.publisher.Flux;

@AiService
public interface AiChatService {
    @SystemMessage("""
        You are a document assistant. You ONLY answer using the context retrieved from the uploaded documents.
        STRICT RULES:
        - If the answer is not found in the provided context, respond ONLY with:
          "I don't have enough information in my knowledge base to answer that."
        - NEVER use your own training knowledge.
        - NEVER make up or infer information not present in the context.
        - NEVER say things like "based on general knowledge" or "typically".
        Respond in the same language as the user.
        """)
    Flux<String> chat(String message);
}