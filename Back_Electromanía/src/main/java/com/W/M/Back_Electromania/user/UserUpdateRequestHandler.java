package com.W.M.Back_Electromania.user;

import org.springframework.data.util.Pair;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;


@Getter
@AllArgsConstructor
@RequiredArgsConstructor
public class UserUpdateRequestHandler {
    private final UserService userService;
    private Pair<Boolean, String> email;
    private Pair<Boolean, String> password;
    private Pair<Boolean, String> nit_ci;
    private Pair<Boolean, String> razon_social;

    public UserUpdateRequestHandler(UserService userService,UserUpdatePasswordRequest user) {
        this.userService = userService;
        if(this.userExistsByEmail(user.email())){
            this.email = Pair.of(true, user.email());
            this.password = Pair.of(true, user.password());
        }
    }
    public UserUpdateRequestHandler(UserService userService,UserUpdateNitRequest user) {
        this.userService = userService;
        if(this.userExistsByEmail(user.email())){
            this.email = Pair.of(true, user.email());
            this.nit_ci = Pair.of(true, user.nit_ci());
            this.razon_social = Pair.of(true, user.razon_social());
        }
    }
    public boolean userExistsByEmail(String email) {
        return userService.existsByEmail(email);
    }
    public User toUser(){
        if(this.email.getFirst() != false){
            User result = userService.getUserByEmail(email.getSecond()).getBody();
            if(password.getFirst() != false) result.setPassword(PasswordUtils.encodePassword(password.getSecond()));
            else{
                result.setNit_ci(nit_ci.getSecond());
                result.setRazon_social(razon_social.getSecond());
            }
            
            return result;
        }
        return null;
    }
}
