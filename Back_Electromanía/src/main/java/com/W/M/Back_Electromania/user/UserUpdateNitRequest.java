package com.W.M.Back_Electromania.user;

import java.util.Objects;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

public record UserUpdateNitRequest(
    @NotBlank(message = "Email is required")    
    @NotNull(message = "El email no puede ser nulo")
    String email,
    @NotNull(message = "El nit_ci no puede ser nulo")
    @NotBlank(message = "El nit_ci no puede ser nulo")
    @Positive
    String nit_ci,
    @NotNull(message = "La razon_social no puede ser nulo")
    @NotBlank(message = "La razon_social no puede ser nulo")
    String razon_social
){
    public UserUpdateNitRequest{
        Objects.requireNonNull(email, "El email no puede ser nulo");
        Objects.requireNonNull(nit_ci, "El nit no puede ser nulo");
        Objects.requireNonNull(razon_social, "La razon social no puede ser nulo");
    }
}
