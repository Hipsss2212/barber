package com.example.projectschedulehaircutserver.exeption;

public class AccountBlockedException extends RuntimeException {
    public AccountBlockedException(String message) {
        super(message);
    }
}
