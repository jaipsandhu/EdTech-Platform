package com.example.demo.dashboard.controller;


import com.example.demo.dashboard.dto.VerifyOtpRequest;
import com.example.demo.dashboard.entity.User;
import com.example.demo.dashboard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/home")
public class AuthController {

private final UserService userService;

    @PostMapping("/signin")
    public void login(@RequestBody User user) {
        userService.login(user);
    }

    @PostMapping("/register")
    public void register(@RequestBody User user) {
        userService.register(user);
    }

    @PostMapping("/verify")
    public void verify(
            @RequestBody VerifyOtpRequest request
    ) {

        userService.verify(
                request.getEmail(),
                request.getOtp()
        );
    }


}
