package com.traffic.demo.exception;

public class FineNotFoundException extends RuntimeException {

    public FineNotFoundException(String message) {
        super(message);
    }
}