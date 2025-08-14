package com.W.M.Back_Electromania.user;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateNitRequest extends UserUpdateRequest{
    @NotNull
    @NotEmpty
    private String nit_ci;
    @NotNull
    @NotEmpty
    private String razon_social;
    @Override
    public User toUser(User user) {
        user.setNit_ci(nit_ci);
        user.setRazon_social(razon_social);
        return user;
    }
}
