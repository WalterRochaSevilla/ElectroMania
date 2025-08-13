package com.W.M.Back_Electromania.user;

import lombok.Getter;

@Getter
public class AdminCreateRequest extends UserCreateRequest {
    private Rol rol = Rol.ADMIN;
    @Override
    public User toUser() {
        User user = super.toUser();
        user.setRol(rol);
        return user;
    }
}
