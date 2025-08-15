package com.W.M.Back_Electromania.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
public class FieldException extends RuntimeException {
    private String field;
    
    public FieldException(String field, String message) {
        super(message);
        this.field = field;
    }
}
