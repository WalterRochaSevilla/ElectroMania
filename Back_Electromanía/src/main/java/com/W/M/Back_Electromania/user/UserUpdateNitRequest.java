package com.W.M.Back_Electromania.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateNitRequest extends UserUpdateRequest{
    @NotBlank(message = "NIT/CI is required")
    private String nit_ci;
    @NotBlank(message = "Razon Social is required")
    private String razon_social;
    @Override
    public User toUser(User user) {
        user.setNit_ci(nit_ci);
        user.setRazon_social(razon_social);
        return user;
    }
}
