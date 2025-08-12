package com.W.M.Back_Electromania.user;
import org.springframework.stereotype.Service;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User saveUser(User user) {
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return user == null ? null : userRepository.save(user);
    }
    public List<User> getAllUsers() { 
        return userRepository.findAll();
    }
}
