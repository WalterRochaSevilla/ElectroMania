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
        return userRepository.save(user);
    }
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email) != null;
    }
    public ResponseEntity<User> createUser(CreateUserRequestHandler user) {
        if (existsByEmail(user.getEmail())) throw new EmailAlreadyExistException("El email ya existe");
        return user == null ? ResponseEntity.notFound().build() : ResponseEntity.ok().body(saveUser(user.toUser()));
    }
    public ResponseEntity<User> updateUser(UserUpdateRequestHandler handler) {
        User existingUser = handler.toUser();
        return existingUser == null ? ResponseEntity.notFound().build() :ResponseEntity.ok().body(saveUser(handler.toUser()));
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
