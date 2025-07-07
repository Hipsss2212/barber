package com.example.projectschedulehaircutserver.exeption;

import org.springframework.dao.DataAccessException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.transaction.TransactionException;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Xử lý các exception liên quan đến xác thực
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Sai tên đăng nhập hoặc mật khẩu.");
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<Object> handleUsernameNotFound(UsernameNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Tài khoản không tồn tại.");
    }

    @ExceptionHandler(LoginException.class)
    public ResponseEntity<Object> handleLoginException(LoginException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    // Xử lý các exception liên quan đến đơn hàng
    @ExceptionHandler(OrderException.class)
    public ResponseEntity<Object> handleOrderException(OrderException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getMessage();

        switch(ex.getErrorType()) {
            case "SCHEDULE_CONFLICT":
                status = HttpStatus.CONFLICT;
                break;
            case "DUPLICATE_SERVICE":
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                break;
            case "INVALID_ORDER":
                status = HttpStatus.BAD_REQUEST;
                break;
            default:
                status = HttpStatus.BAD_REQUEST;
        }

        return buildResponse(status, message);
    }

    // Xử lý các exception liên quan đến dữ liệu
    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Object> handleNoSuchElement(NoSuchElementException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy dữ liệu yêu cầu: " + ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return buildResponse(
                HttpStatus.CONFLICT,
                "Lỗi toàn vẹn dữ liệu: " + ex.getMostSpecificCause().getMessage()
        );
    }

    @ExceptionHandler(AlreadyLoggedInException.class)
    public ResponseEntity<Object> handleAlreadyLoggedIn(AlreadyLoggedInException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }


    // Xử lý các exception liên quan đến transaction
    @ExceptionHandler(TransactionException.class)
    public ResponseEntity<Object> handleTransactionException(TransactionException ex) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Lỗi trong quá trình xử lý giao dịch: " + ex.getMostSpecificCause().getMessage()
        );
    }

    // Xử lý các exception khác
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage()
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleOtherExceptions(Exception ex) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Lỗi máy chủ không xác định: " + ex.getMessage()
        );
    }


    @ExceptionHandler(CartItemException.class)
    public ResponseEntity<Object> handleCartItemException(CartItemException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ComboException.class)
    public ResponseEntity<Object> handleComboException(ComboException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<Object> handleEmptyResultDataAccess(EmptyResultDataAccessException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy dữ liệu");
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Object> handleDataAccessException(DataAccessException ex) {
        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Lỗi hệ thống khi truy cập dữ liệu: " + ex.getMessage()
        );
    }
    @ExceptionHandler(AccountBlockedException.class)
    public ResponseEntity<Object> handleBlockedAccount(AccountBlockedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN,  ex.getMessage());
    }


    // Phương thức hỗ trợ tạo response
    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        Map<String, Object> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", status.value());
        errorDetails.put("error", status.getReasonPhrase());
        errorDetails.put("message", message);
        return new ResponseEntity<>(errorDetails, status);
    }
}