package com.example.demo.content.repository;

import com.example.demo.content.entity.Content;
import com.example.demo.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentRepository extends JpaRepository<Content,Long> {
    List<Content> findByActiveTrue();
}
