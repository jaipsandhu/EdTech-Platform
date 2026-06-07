package com.example.demo.dashboard.otp;

import com.example.demo.dashboard.entity.User;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Random;

@Service
public class OtpService {

    private final HashMap<String, String> otpStorage =
            new HashMap<>();

    private final HashMap<String, User> pendingUsers =
            new HashMap<>();

    public String generateOtp(String email) {

        Random random = new Random();

        String otp =
                String.valueOf(
                        100000 +
                                random.nextInt(900000)
                );

        otpStorage.put(email, otp);

        return otp;
    }

    public void storePendingUser(User user) {

        pendingUsers.put(
                user.getEmail(),
                user
        );
    }

    public User getPendingUser(String email) {

        return pendingUsers.get(email);
    }

    public void removePendingUser(String email) {

        pendingUsers.remove(email);
    }

    public boolean verifyOtp(
            String email,
            String enteredOtp
    ) {

        String storedOtp =
                otpStorage.get(email);

        boolean valid =
                storedOtp != null &&
                        storedOtp.equals(enteredOtp);

        if(valid) {

            otpStorage.remove(email);
        }

        return valid;
    }
}