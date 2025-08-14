package com.W.M.Back_Electromania.user;
import org.springframework.stereotype.Service;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User saveUser(User user){
        return userRepository.save(user);
    }
    public User createUser(UserCreateRequest user) {
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return user == null ? null : saveUser(user.toUser());
    }
    public User updateUser(UserUpdateRequest user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        return existingUser == null ? null : saveUser(user.toUser(existingUser));
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
