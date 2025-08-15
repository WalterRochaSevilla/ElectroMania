package com.W.M.Back_Electromania.user;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.W.M.Back_Electromania.exceptions.EmailAlreadyExistException;
import com.W.M.Back_Electromania.utils.PasswordUtils;

import java.util.List;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public User saveUser(User user){
        if(userRepository.findByEmail(user.getEmail()) != null)
            throw new EmailAlreadyExistException("Email already exists");
        return userRepository.save(user);
    }
    public ResponseEntity<User> createUser(UserCreateRequest user) {
        user.setPassword(PasswordUtils.encodePassword(user.getPassword()));
        return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(saveUser(user.toUser()));
    }
    public ResponseEntity<User> updateUser(UserUpdateRequest user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        return existingUser == null ? ResponseEntity.notFound().build() :ResponseEntity.ok().body(saveUser(user.toUser(existingUser)));
    }
    public ResponseEntity<List<User>> getAllUsers() { 
        return userRepository.findAll() == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(userRepository.findAll());
    }
    public ResponseEntity<User> getUserByNit(String nit) {
        return userRepository.findByNit(nit) == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(userRepository.findByNit(nit));
    }
    public ResponseEntity<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email) == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(userRepository.findByEmail(email));
    }
    public ResponseEntity<List<User>> getUserByRol(String rol) {
        return userRepository.findByRol(rol) == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(userRepository.findByRol(rol));
    }
}
