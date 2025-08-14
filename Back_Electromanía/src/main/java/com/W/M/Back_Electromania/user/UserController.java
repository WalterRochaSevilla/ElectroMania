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
    public void createUser(@RequestBody UserCreateRequest user) {
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
    @GetMapping("/all")
    public List<User> getAll() {
        return userService.getAllUsers();
    }
    @GetMapping("/by-nit")
    public User getByNit(@RequestParam String nit) {
        return userService.getUserByNit(nit);
    }
    @GetMapping("/email")
    public User getByEmail(@RequestParam String email) {
        return userService.getUserByEmail(email);
    }
    @GetMapping("/by-rol")
    public List<User> getByRol(@RequestParam String rol) {
        return userService.getUserByRol(rol);
    }
    
}
