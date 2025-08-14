package com.W.M.Back_Electromania.user;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdatePasswordRequest extends UserUpdateRequest {
    @NotNull
    @NotEmpty
    private String password;
    @Override
    public User toUser(User user) {
        user.setPassword(PasswordUtils.encodePassword(password));
        return user;
    }
}
