package com.W.M.Back_Electromania.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserCreateRequest {
    @NotBlank(message = "Nombre is required")
    private String nombre;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;
    @NotBlank(message = "Password is required")
    @Size(min=8,max=20, message = "Password must be at least 8 characters long and at most 20 characters long")
    private String password;
    @NotBlank(message = "NIT/CI is required")
    private String nit_ci;
    @NotBlank(message = "Razon Social is required")
    private String razon_social;
    public User toUser(){
        return new User(null,nombre, email, password, nit_ci, razon_social, true, Rol.CLIENTE);
    }
}
