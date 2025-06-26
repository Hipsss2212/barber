package com.example.projectschedulehaircutserver.exeption;

public class AlreadyLoggedInException extends RuntimeException{
    public AlreadyLoggedInException(String message) {
        super(message);
    }
}
