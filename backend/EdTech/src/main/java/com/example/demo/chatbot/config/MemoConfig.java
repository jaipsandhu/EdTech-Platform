package com.example.demo.chatbot.config;

import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.memory.chat.ChatMemoryProvider;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.pgvector.PgVectorEmbeddingStore;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MemoConfig {
    private EmbeddingModel embeddingModel;
    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    public MemoConfig(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    @Bean
    public ChatMemoryProvider chatMemoryProvider() {
        // Creates a memory provider that:
        // - Maintains separate chat history for each chat ID
        // - Keeps last 10 messages in memory for context
        // - Helps maintain conversation coherence
        return chatId -> MessageWindowChatMemory.withMaxMessages(10);
    }

    @Bean
    public EmbeddingStore<TextSegment> embeddingStore() {
        // Configures PostgreSQL with pgvector extension to:
        // - Store document embeddings as vectors
        // - Enable similarity search
        // - Auto-create required tables
        // - Match embedding dimensions with model
        return PgVectorEmbeddingStore.builder()
                .host("localhost")
                .port(5432)
                .database("edtech")
                .user("postgres")
                .password("postgres")
                .table("my_embeddings")
                .dimension(768)
                .createTable(true)
                .build();

    }
}