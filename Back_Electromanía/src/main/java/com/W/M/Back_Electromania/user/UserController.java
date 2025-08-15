package com.W.M.Back_Electromania.user;

import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @PostMapping("/create")
    public void createUser(@Validated @RequestBody UserCreateRequest user) {
        userService.createUser(user);
    }
    @PostMapping("/create-admin")
    public void createAdmin(@RequestBody AdminCreateRequest user) {
        userService.createUser(user);
    }
    @PostMapping("/update-nit")
    public void updateUserNit(@RequestBody UserUpdateNitRequest user) {
        userService.updateUser(user);
    }
    @PostMapping("/update-password")
    public ResponseEntity<User> updateUserPassword(@Valid @RequestBody UserUpdatePasswordRequest user) {
        return userService.updateUser(user);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAll() {
        return userService.getAllUsers();
    }
    @GetMapping("/by-nit")
    public ResponseEntity<User> getByNit(@RequestParam String nit) {
        return userService.getUserByNit(nit);
    }
    @GetMapping("/email")
    public ResponseEntity<User> getByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
    @GetMapping("/by-rol")
    public ResponseEntity<List<User>> getByRol(@RequestParam String rol) {
        return userService.getUserByRol(rol);
    }
    
}
