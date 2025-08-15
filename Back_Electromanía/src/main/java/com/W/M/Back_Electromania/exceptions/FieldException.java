package com.W.M.Back_Electromania.exceptions;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FieldException extends Exception {
    protected String field;
    public FieldException(String field, String message) {
        super(message);
        this.field = field;
    }
}
