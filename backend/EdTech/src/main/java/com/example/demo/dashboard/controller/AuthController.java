package com.example.demo.dashboard.controller;


import com.example.demo.dashboard.dto.*;
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
    public LoginResponseDTO login(
            @RequestBody LoginRequestDTO dto
    ) {

        return userService.login(dto);
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

    @PostMapping("/recovery")
    public void recovery(
            @RequestBody RecoveryRequest request
            ) {
        userService.recovery(request.getEmail());
    }



    @PostMapping("/rverify")
    public void rverify(@RequestBody VerifyOtpRequest request) {
        userService.recoveryVerify(request.getEmail(),request.getOtp());
    }

    @PostMapping("/newpass")
    public void newpass(@RequestBody NewPass newPass) {
        userService.newPassword(newPass.getEmail(),newPass.getPassword());
    }


}
