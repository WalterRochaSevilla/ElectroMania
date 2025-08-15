package com.W.M.Back_Electromania.exceptions;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import javax.validation.ConstraintViolationException;

@RestControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(Exception ex) {
        ErrorResponse response = new ErrorResponse();
        response.setStatus(getHttpStatus(ex));
        response.setMessage("Error de validación");
        response.setErrors(saveError(ex));
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    public Map<String,String> saveError(Exception ex) {
        if( ex instanceof EmailAlreadyExistException){
            Map<String, String> errors = new HashMap<>();
            errors.put("email", ex.getMessage());
            return errors;
        } else {
            Map<String, String> errors = new HashMap<>();
            errors.put("error", ex.getMessage());
            return errors;
        }
    }

    private int getHttpStatus(Exception ex) {
        if (ex instanceof MethodArgumentNotValidException) {
            return HttpStatus.BAD_REQUEST.value();
        } else if (ex instanceof ConstraintViolationException) {
            return HttpStatus.UNPROCESSABLE_ENTITY.value();
        }
        return HttpStatus.INTERNAL_SERVER_ERROR.value();
    }
}
