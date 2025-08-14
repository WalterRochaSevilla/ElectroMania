package com.W.M.Back_Electromania.user;

import io.micrometer.common.lang.NonNull;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserUpdateRequest {
    @NonNull
    @NotEmpty
    protected String email;
    public User toUser(User user) {
        if (user == null) {
            user = new User();
        }
        user.setEmail(email);
        return user;
    };
}
