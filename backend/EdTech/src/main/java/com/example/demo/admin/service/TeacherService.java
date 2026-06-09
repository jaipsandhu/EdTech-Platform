package com.example.demo.admin.service;

import com.example.demo.admin.dto.EditUserDTO;
import com.example.demo.admin.dto.UserListDTO;
import com.example.demo.admin.repository.UserRepository;
import com.example.demo.dashboard.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class TeacherService {
    private final UserRepository userRepository;


    public List<UserListDTO> getTeachers() {

        List<User> teachers =
                userRepository.findByRole("TEACHER");

        List<UserListDTO> dtoList =
                new ArrayList<>();

        for(User user : teachers) {

            UserListDTO dto =
                    new UserListDTO();

            dto.setId(user.getId());

            dto.setUsername(user.getUsername());

            dto.setEmail(user.getEmail());

            dto.setRole(user.getRole());

            dtoList.add(dto);

        }

        return dtoList;

    }


    public void deleteTeacher(Long id) {

        userRepository.deleteById(id);

    }



    public void editTeacher(
            Long id,
            EditUserDTO dto
    ) {

        User user =
                userRepository.findById(id)
                        .orElseThrow();
        

        user.setEmail(dto.getEmail());

        user.setRole(dto.getRole());

        userRepository.save(user);

    }






}
