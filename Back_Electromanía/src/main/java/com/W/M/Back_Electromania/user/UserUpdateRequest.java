package com.W.M.Back_Electromania.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserUpdateRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    protected String email;
    public User toUser(User user) {
        if (user == null) {
            user = new User();
        }
        user.setEmail(email);
        return user;
    };
}
