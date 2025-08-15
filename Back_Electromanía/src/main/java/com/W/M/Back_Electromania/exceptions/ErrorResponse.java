package com.W.M.Back_Electromania.exceptions;

import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {
    private int status;
    private String message;
    private Map<String, String> errors;
}
