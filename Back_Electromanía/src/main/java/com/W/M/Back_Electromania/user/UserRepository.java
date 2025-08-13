package com.W.M.Back_Electromania.user;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository <User, Long>{
    @Query("SELECT u FROM User u WHERE u.nit_ci = ?1")
    public User findByNit(@Param("nit") String nit);
    @Query("SELECT u FROM User u WHERE u.email = ?1 ")
    public User findByEmail(@Param("email") String email);
    @Query("SELECT u FROM User u WHERE u.rol = ?1")
    public List<User> findByRol(@Param("rol") String rol);
}
