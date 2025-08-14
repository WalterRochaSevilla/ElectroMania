package com.W.M.Back_Electromania.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserCreateRequest {
    @NotNull
    @NotEmpty
    private String nombre;

    @NotNull
    @NotEmpty
    private String email;
    @NotNull
    @NotEmpty
    private String password;
    @NotNull
    @NotEmpty
    private String nit_ci;
    @NotNull
    @NotEmpty
    private String razon_social;
    public User toUser(){
        return new User(null,nombre, email, password, nit_ci, razon_social, true, Rol.CLIENTE);
    }
}
