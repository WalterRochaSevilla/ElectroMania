package com.W.M.Back_Electromania.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateNitRequest extends UserUpdateRequest{
    private String nit_ci;
    private String razon_social;
    @Override
    public User toUser(User user) {
        user.setNit_ci(nit_ci);
        user.setRazon_social(razon_social);
        return user;
    }
}
