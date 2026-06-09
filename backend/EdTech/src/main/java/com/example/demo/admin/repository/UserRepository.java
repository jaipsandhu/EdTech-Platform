package com.example.demo.admin.repository;

import com.example.demo.dashboard.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository <User, Long>{
    List<User> findByRole(String role);
}
