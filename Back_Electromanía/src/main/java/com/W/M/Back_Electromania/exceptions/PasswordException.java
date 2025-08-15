package com.W.M.Back_Electromania.exceptions;

public class PasswordException extends FieldException {
    public PasswordException(String message) {
        super("password", message);
    }
}
