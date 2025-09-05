package com.W.M.Back_Electromania.user;

import java.util.Objects;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

public record AdminCreateRequest(
    @NotNull
    @NotBlank(message = "El nombre no puede ser nulo")
    String nombre,
    @NotNull
    @NotBlank(message = "El email no puede ser nulo")
    @Email(message = "Email should be valid")
    String email,
    @NotNull
    @Size(min=8,max=20, message = "Password must be at least 8 characters long and at most 20 characters long")
    String password,
    @NotNull
    @NotBlank(message = "El nit_ci no puede ser nulo")
    String nit_ci,
    @NotNull
    @NotBlank(message = "La razon_social no puede ser nulo")
    String razon_social
) {
    public AdminCreateRequest{
        Objects.requireNonNull(nombre, "El nombre no puede ser nulo");
        Objects.requireNonNull(email, "El email no puede ser nulo");
        Objects.requireNonNull(password, "El password no puede ser nulo");
        Objects.requireNonNull(nit_ci, "El nit_ci no puede ser nulo");
        Objects.requireNonNull(razon_social, "La razon_social no puede ser nulo");
    }
}

