package com.W.M.Back_Electromania.user;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PostMapping("/create")
    public void createUser(@RequestBody com.W.M.Back_Electromania.user.User user) {
        userService.saveUser(user);
    }
    @GetMapping("/all")
    public List<User> getAll() {
        return userService.getAllUsers();
    }
    
}
