package com.example.demo.dashboard.service;

import com.example.demo.dashboard.entity.User;
import com.example.demo.dashboard.otp.EmailService;
import com.example.demo.dashboard.otp.OtpService;
import com.example.demo.dashboard.otp.RecoveryOTPService;
import com.example.demo.dashboard.repository.UserRepository;

import com.example.demo.dashboard.config.JwtUtil;

import com.example.demo.dashboard.dto.LoginRequestDTO;
import com.example.demo.dashboard.dto.LoginResponseDTO;

import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationManager
            authenticationManager;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder encoder;

    private final UserRepository userRepository;

    private final OtpService otpService;

    private final EmailService emailService;

    private final RecoveryOTPService recoveryOTPService;

    public LoginResponseDTO login(
            LoginRequestDTO dto
    ) {

        authenticationManager.authenticate(

                new UsernamePasswordAuthenticationToken(

                        dto.getEmail(),

                        dto.getPassword()
                )
        );

        User user =
                userRepository.findByEmail(
                        dto.getEmail()
                );

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        return new LoginResponseDTO(

                token,

                user.getRole()
        );
    }

    public void register(User user) {

        User existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                );

        if (existingUser != null) {

            System.out.println("Email already exists");

            return;
        }

        user.setPassword(
                encoder.encode(
                        user.getPassword()
                )
        );

        String otp =
                otpService.generateOtp(
                        user.getEmail()
                );

        emailService.sendEmail(
                user.getEmail(),
                "OTP Verification",
                "Your OTP is: " + otp
        );

        otpService.storePendingUser(user);

        System.out.println("OTP generated");
    }

    public void save(User user) {

        user.setRole("STUDENT");
        //default role for all set to student

        userRepository.save(user);

        System.out.println(
                user.getEmail()
                        + " registered successfully"
        );
    }

    public void verify(
            String email,
            String otp
    ) {

        boolean valid =
                otpService.verifyOtp(
                        email,
                        otp
                );

        if (valid) {

            User pendingUser =
                    otpService.getPendingUser(
                            email
                    );




            save(pendingUser);
            otpService.removePendingUser(email);

            System.out.println(
                    "OTP verified successfully"
            );

        } else {

            System.out.println("Invalid OTP");
        }
    }


    public void recovery(String email) {
        if (userRepository.findByEmail(email) != null) {

            String otp =
                    recoveryOTPService.generateOtp(email);

            emailService.sendEmail(
                    email,
                    "OTP Verification",
                    "Your OTP is: " + otp
            );

            System.out.println("OTP generated");


        } else {
            System.out.println("User not found");
        }
    }


    public void recoveryVerify(
            String email,
            String otp
    ) {

        boolean valid =
                recoveryOTPService.verifyOtp(
                        email,
                        otp
                );

        if (valid) {


            System.out.println("verification successful");



        } else {

            System.out.println("Invalid OTP");
        }
    }

    public void newPassword(
            String email,
            String password
    ) {

        if(!recoveryOTPService.isVerifiedUser(email)) {

            System.out.println("OTP verification required");

            return;
        }

        User user =
                userRepository.findByEmail(email);

        if(user != null) {

            user.setPassword(
                    encoder.encode(password)
            );

            userRepository.save(user);
            recoveryOTPService.removeVerifiedUser(email);

            System.out.println(
                    "Password updated successfully"
            );



        } else {

            System.out.println("User not found");
        }
    }
}