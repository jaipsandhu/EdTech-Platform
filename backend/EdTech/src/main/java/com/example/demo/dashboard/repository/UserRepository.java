package com.example.demo.dashboard.repository;


import com.example.demo.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository
        extends JpaRepository<User, Long> {

    User findByEmail(String email);
}