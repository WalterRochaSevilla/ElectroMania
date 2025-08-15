package com.W.M.Back_Electromania.user;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdatePasswordRequest extends UserUpdateRequest {
    @NotBlank(message = "Password is required")
    @Size(min=8,max=20, message = "Password must be at least 8 characters long and at most 20 characters long")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$", message = "Password must contain at least one letter, one number, and one special character")
    private String password;
    @Override
    public User toUser(User user) {
        user.setPassword(PasswordUtils.encodePassword(password));
        return user;
    }
}
