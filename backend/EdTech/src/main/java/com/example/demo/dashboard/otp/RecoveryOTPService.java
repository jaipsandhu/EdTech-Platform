package com.example.demo.dashboard.otp;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Random;

@Service
public class RecoveryOTPService {

    private final HashMap<String, String> recoveryOtpStorage =
            new HashMap<>();

    private final HashMap<String, Boolean> verifiedUsers =
            new HashMap<>();

    public String generateOtp(String email) {

        Random random = new Random();

        String otp =
                String.valueOf(
                        100000 +
                                random.nextInt(900000)
                );

        recoveryOtpStorage.put(email, otp);

        return otp;
    }



    public boolean verifyOtp(
            String email,
            String enteredOtp
    ) {

        String storedOtp =
                recoveryOtpStorage.get(email);

        boolean valid =
                storedOtp != null &&
                        storedOtp.equals(enteredOtp);

        if(valid) {
            verifiedUsers.put(email, true);
            recoveryOtpStorage.remove(email);
        }

        return valid;
    }

    public boolean isVerifiedUser(String email) {

        return verifiedUsers.get(email) != null;
    }

    public void removeVerifiedUser(String email) {

        verifiedUsers.remove(email);
    }
}


