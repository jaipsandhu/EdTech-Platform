package com.example.demo.chatbot.config;

import dev.langchain4j.data.document.splitter.DocumentSplitters;
import dev.langchain4j.data.segment.TextSegment;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.rag.content.retriever.EmbeddingStoreContentRetriever;
import dev.langchain4j.store.embedding.EmbeddingStore;
import dev.langchain4j.store.embedding.EmbeddingStoreIngestor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EmbeddingConfig {

    @Bean
    public EmbeddingStoreIngestor embeddingStoreIngestor(EmbeddingModel embeddingModel,
                                                         EmbeddingStore<TextSegment> embeddingStore) {
        return EmbeddingStoreIngestor.builder()
                .documentSplitter(DocumentSplitters.recursive(1000, 100))
                .embeddingModel(embeddingModel)
                .embeddingStore(embeddingStore)
                .build();
    }

    @Bean
    public EmbeddingStoreContentRetriever embeddingStoreContentRetriever(
            EmbeddingStore<TextSegment> embeddingStore,
            EmbeddingModel embeddingModel) {
        return EmbeddingStoreContentRetriever.builder()
                .embeddingStore(embeddingStore)
                .embeddingModel(embeddingModel)
                .maxResults(5)
                .minScore(0.75)
                .build();
    }
}