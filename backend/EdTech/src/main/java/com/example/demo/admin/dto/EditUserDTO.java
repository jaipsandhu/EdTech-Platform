package com.example.demo.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditUserDTO {

    private String username;

    private String email;

    private String role;
}