package com.traffic.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class PayHereConfig {

    @Value("${PAYHERE_MERCHANT_ID}")
    private String merchantId;

    @Value("${PAYHERE_MERCHANT_SECRET}")
    private String merchantSecret;

    public static final String PAYHERE_SANDBOX_URL =
            "https://sandbox.payhere.lk/pay/checkout";

    public String getMerchantId() {
        return merchantId;
    }

    public String getMerchantSecret() {
        return merchantSecret;
    }
}