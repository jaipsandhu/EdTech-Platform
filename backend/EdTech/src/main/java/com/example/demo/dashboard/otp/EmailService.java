package com.example.demo.dashboard.otp;


import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;

import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    public void sendEmail(
            String toEmail,
            String subject,
            String body
    ) {

        Email from =
                new Email("jaipsandhu@gmail.com");

        Email to =
                new Email(toEmail);

        Content content =
                new Content(
                        "text/plain",
                        body
                );

        Mail mail =
                new Mail(
                        from,
                        subject,
                        to,
                        content
                );

        SendGrid sendGrid =
                new SendGrid(sendGridApiKey);

        Request request =
                new Request();

        try {

            request.setMethod(Method.POST);

            request.setEndpoint("mail/send");

            request.setBody(mail.build());

            Response response =
                    sendGrid.api(request);

            System.out.println(
                    response.getStatusCode()
            );

        } catch (Exception e) {

            e.printStackTrace();
        }
    }
}
