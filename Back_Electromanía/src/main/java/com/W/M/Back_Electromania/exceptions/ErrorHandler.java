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
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Error de validación");
        response.setErrors(saveError(ex));
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


    public Map<String,String> saveError(Exception ex) {
        if( ex instanceof FieldException){
            FieldException fe = (FieldException) ex;
            Map<String, String> errors = new HashMap<>();
            errors.put(fe.getField(), ex.getMessage());
            return errors;
        } else if(ex instanceof MethodArgumentNotValidException){
            return ((MethodArgumentNotValidException) ex).getBindingResult().getFieldErrors().stream().collect(HashMap::new, (map, error) -> map.put(error.getField(), error.getDefaultMessage()), HashMap::putAll);
        }
        else {
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
