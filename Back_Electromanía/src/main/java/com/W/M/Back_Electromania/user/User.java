package com.W.M.Back_Electromania.user;

import jakarta.persistence.Basic;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

enum Rol {
    ADMIN, CLIENTE
}
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long id;
    @Basic
    private String nombre;
    private String email;
    private String password;
    private String nit_ci;
    private String razon_social;
    private Boolean activo;
    private Rol rol;
}
