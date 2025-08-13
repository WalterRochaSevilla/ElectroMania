package com.W.M.Back_Electromania.user;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserCreateRequest {
    private String nombre;
    private String email;
    private String password;
    private String nit_ci;
    private String razon_social;
    public User toUser(){
        return new User(null,nombre, email, password, nit_ci, razon_social, true, Rol.CLIENTE);
    }
}
