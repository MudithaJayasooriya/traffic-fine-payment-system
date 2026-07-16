package com.traffic.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.HashMap;
import java.util.Map;

@Service
public class SmsServiceImpl implements SmsService {

    @Value("${textlk.sms.api-url}")
    private String apiUrl;

    @Value("${textlk.sms.api-token}")
    private String apiToken;

    @Value("${textlk.sms.sender-id}")
    private String senderId;

    @Override
    public void sendSmsToOfficer(String phone, String message) {
        String formattedPhone = formatPhoneNumber(phone);

        System.out.println("===== SMS NOTIFICATION =====");
        System.out.println("Officer Phone: " + formattedPhone);
        System.out.println("Sending SMS...");

        if (apiToken == null || apiToken.trim().isEmpty()) {
            System.out.println("HTTP Status: N/A");
            System.out.println("API Response: SMS Authentication Failed - API Token is null or empty");
            System.out.println("SMS Sending Failed");
            return;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiToken);
            headers.set("Accept", "application/json");

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("recipient", formattedPhone);
            requestBody.put("sender_id", senderId);
            requestBody.put("type", "plain");
            requestBody.put("message", message);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            System.out.println("HTTP Status: " + response.getStatusCode().value());
            System.out.println("API Response: " + response.getBody());
            System.out.println("SMS Sent Successfully");
        } catch (HttpStatusCodeException e) {
            System.out.println("HTTP Status: " + e.getStatusCode().value());
            System.out.println("API Response: " + e.getResponseBodyAsString());
            System.out.println("SMS Sending Failed");
        } catch (RestClientException e) {
            System.out.println("HTTP Status: N/A");
            System.out.println("API Response: " + e.getMessage());
            System.out.println("SMS Sending Failed");
        } catch (Exception e) {
            System.out.println("HTTP Status: N/A");
            System.out.println("API Response: " + e.getMessage());
            System.out.println("SMS Sending Failed");
        }
    }

    private String formatPhoneNumber(String phone) {
        if (phone == null) {
            return null;
        }
        // Remove spaces and dashes
        String cleanPhone = phone.replaceAll("\\s+", "").replaceAll("-", "");

        // Remove leading '+'
        if (cleanPhone.startsWith("+")) {
            cleanPhone = cleanPhone.substring(1);
        }

        // Convert 07... to 947...
        if (cleanPhone.startsWith("0")) {
            cleanPhone = "94" + cleanPhone.substring(1);
        }

        return cleanPhone;
    }
}