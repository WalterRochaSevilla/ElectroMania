package com.W.M.Back_Electromania.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


public class PasswordUtils {
    private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public static String encodePassword(String password) {
        return encoder.encode(password);
    }
    public static boolean matches(String password, String encodedPassword) {
        return encoder.matches(password, encodedPassword);
    }
}
