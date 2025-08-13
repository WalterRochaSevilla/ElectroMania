package com.W.M.Back_Electromania.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@AllArgsConstructor
@Getter
public class UserUpdateNitRequest extends UserUpdateRequest{
    private final UserService userService;
    private String nit_ci;
    private String razon_social;
    public User toUser(){
        User user =  userService.getUserByEmail(super.getEmail());
        user.setNit_ci(nit_ci);
        user.setRazon_social(razon_social);
        return user;
    }
}
