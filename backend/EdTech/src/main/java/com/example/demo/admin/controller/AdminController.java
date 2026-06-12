package com.example.demo.admin.controller;


import com.example.demo.admin.dto.EditUserDTO;
import com.example.demo.admin.dto.UserListDTO;
import com.example.demo.admin.service.StudentService;
import com.example.demo.admin.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    private final StudentService studentService;
    private final TeacherService teacherService;

    @GetMapping("/students")
    public List<UserListDTO> getStudents(){
        return studentService.getStudents();
    }


    @DeleteMapping("/students/{id}")
    public void deleteStudent(
            @PathVariable Long id
    ) {

        studentService.deleteStudent(id);

    }

    @PutMapping("/students/{id}")
    public void editStudent(
            @PathVariable Long id,
            @RequestBody EditUserDTO dto
    ) {

        studentService.editStudent(id, dto);

    }

    @GetMapping("/teachers")
    public List<UserListDTO> getTeachers() {

        return teacherService.getTeachers();

    }


    @DeleteMapping("/teachers/{id}")
    public void deleteTeacher(
            @PathVariable Long id
    ) {

        teacherService.deleteTeacher(id);

    }

    @PutMapping("/teachers/{id}")
    public void editTeacher(
            @PathVariable Long id,
            @RequestBody EditUserDTO dto
    ) {

        teacherService.editTeacher(id, dto);

    }



}
