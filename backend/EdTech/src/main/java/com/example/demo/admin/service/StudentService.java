package com.example.demo.admin.service;


import com.example.demo.admin.dto.EditUserDTO;
import com.example.demo.admin.dto.UserListDTO;
import com.example.demo.admin.repository.AdminRepository;
import com.example.demo.dashboard.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@Service
public class StudentService {
    private final AdminRepository adminRepository;


    public List<UserListDTO> getStudents() {

        List<User> students =
                adminRepository.findByRole("STUDENT");

        List<UserListDTO> dtoList =
                new ArrayList<>();

        for(User user : students) {

            UserListDTO dto =
                    new UserListDTO();

            dto.setId(user.getId());



            dto.setEmail(user.getEmail());

            dto.setRole(user.getRole());

            dtoList.add(dto);
        }

        return dtoList;
    }

    public void deleteStudent(Long id) {

        adminRepository.deleteById(id);
        System.out.println("Student Deleted Successfully");

    }

    public void editStudent(
            Long id,
            EditUserDTO dto
    ) {

        User user =
                adminRepository.findById(id)
                        .orElseThrow();

        user.setEmail(dto.getEmail());

        user.setRole(dto.getRole());

        adminRepository.save(user);

    }





}
