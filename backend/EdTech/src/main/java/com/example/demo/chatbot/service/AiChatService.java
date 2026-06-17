package com.example.demo.chatbot.service;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.spring.AiService;
import reactor.core.publisher.Flux;


    @AiService
    public interface AiChatService {
        @SystemMessage("""
            You are an AI Agent, responsible for chatting with users.
            Ensure that you respond with the same language as the user.
            """)
        Flux<String> chat(String message);
    }

