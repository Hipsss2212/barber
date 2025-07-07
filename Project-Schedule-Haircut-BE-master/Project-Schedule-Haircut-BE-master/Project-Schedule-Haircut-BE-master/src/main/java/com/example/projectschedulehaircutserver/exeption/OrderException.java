package com.example.projectschedulehaircutserver.exeption;

public class OrderException extends Exception{
    private final String errorType; // Có thể thêm field này để phân loại

    public OrderException(String message) {
        super(message);
        this.errorType = "GENERAL";
    }

    public OrderException(String message, String errorType) {
        super(message);
        this.errorType = errorType;
    }

    public String getErrorType() {
        return errorType;
    }
}
