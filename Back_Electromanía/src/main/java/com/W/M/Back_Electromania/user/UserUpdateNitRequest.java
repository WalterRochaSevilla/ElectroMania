package com.W.M.Back_Electromania.user;

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
}
