package com.W.M.Back_Electromania.exceptions;

public class EmailAlreadyExistException  extends FieldException {
    public EmailAlreadyExistException(String message) {
        super("email",message);
    }

}
