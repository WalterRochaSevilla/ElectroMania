package com.W.M.Back_Electromania.user;
import org.springframework.stereotype.Service;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User saveUser(UserCreateRequest user) {
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return user == null ? null : 
        userRepository.save(user.toUser());
    }
    public List<User> getAllUsers() { 
        return userRepository.findAll();
    }
    public User getUserByNit(String nit) {
        return userRepository.findByNit(nit);
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    public List<User> getUserByRol(String rol) {
        return userRepository.findByRol(rol);
    }
}
