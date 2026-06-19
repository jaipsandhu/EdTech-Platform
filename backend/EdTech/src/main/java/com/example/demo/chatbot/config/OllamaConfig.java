package com.example.demo.chatbot.config;

import dev.langchain4j.model.chat.ChatLanguageModel;
import dev.langchain4j.model.chat.StreamingChatLanguageModel;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.ollama.OllamaChatModel;
import dev.langchain4j.model.ollama.OllamaEmbeddingModel;
import dev.langchain4j.model.ollama.OllamaStreamingChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;   // ← Add this import

@Configuration
public class OllamaConfig {

    private static final String BASE_URL = "http://localhost:11434";

    private static final String CHAT_MODEL = "llama3.2:1b";           // Faster model

    private static final String EMBEDDING_MODEL = "nomic-embed-text:latest";

    @Bean
    public ChatLanguageModel chatLanguageModel() {
        return OllamaChatModel.builder()
                .baseUrl(BASE_URL)
                .temperature(0.0)
                .modelName(CHAT_MODEL)
                .timeout(Duration.ofSeconds(90))     // ← Added timeout
                .build();
    }

    @Bean
    public StreamingChatLanguageModel streamingChatLanguageModel() {
        return OllamaStreamingChatModel.builder()
                .baseUrl(BASE_URL)
                .temperature(0.0)
                .modelName(CHAT_MODEL)
                .timeout(Duration.ofSeconds(90))     // ← Added timeout
                .build();
    }

    @Bean
    public EmbeddingModel embeddingModel() {
        return OllamaEmbeddingModel.builder()
                .baseUrl(BASE_URL)
                .modelName(EMBEDDING_MODEL)
                .build();
    }
}