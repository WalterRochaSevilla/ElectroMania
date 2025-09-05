package com.W.M.Back_Electromania.user;

import java.util.Objects;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

public record UserUpdatePasswordRequest (
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @NotNull(message = "El email no puede ser nulo")
    String email,
    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$", message = "Password must contain at least one letter, one number, and one special character")
    String password){
    public UserUpdatePasswordRequest {
        Objects.requireNonNull(email, "El email no puede ser nulo");
        Objects.requireNonNull(password, "El password no puede ser nulo");
    }
}
