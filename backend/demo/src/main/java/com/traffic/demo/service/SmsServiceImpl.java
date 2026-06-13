package com.traffic.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

@Service
public class SmsServiceImpl implements SmsService {

    private final String API_URL = "https://e-sms.dialog.lk/api/v1/send";

    @Override
    public void sendSmsToOfficer(String phone, String message) {

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody =
                "{"
                        + "\"sourceAddress\":\"TrafficSystem\","
                        + "\"message\":\"" + message + "\","
                        + "\"destinationAddresses\":[\"" + phone + "\"]"
                        + "}";

        HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

        try {
            restTemplate.postForEntity(API_URL, entity, String.class);
            System.out.println("SMS sent successfully");
        } catch (Exception e) {
            System.out.println("SMS failed: " + e.getMessage());
        }
    }
}