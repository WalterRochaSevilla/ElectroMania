package com.W.M.Back_Electromania.user;
import com.W.M.Back_Electromania.utils.PasswordUtils;

import lombok.Getter;

@Getter
public class CreateUserRequestHandler {
    private String nombre;
    private String email;
    private String password;
    private String nit_ci;
    private String razon_social;
    private Rol rol;
    public CreateUserRequestHandler(UserCreateRequest user) {
        this.nombre = user.nombre();
        this.email = user.email();
        this.password = PasswordUtils.encodePassword(user.password());
        this.nit_ci = user.nit_ci();
        this.razon_social = user.razon_social();
        this.rol = Rol.CLIENTE;
    }
    public CreateUserRequestHandler(AdminCreateRequest user) {
        this.nombre = user.nombre();
        this.email = user.email();
        this.password = PasswordUtils.encodePassword(user.password());
        this.nit_ci = user.nit_ci();
        this.razon_social = user.razon_social();
        this.rol = Rol.ADMIN;
    }
    public User toUser() {
        return new User(null,nombre, email,password, nit_ci, razon_social, true, rol);
    }
}
