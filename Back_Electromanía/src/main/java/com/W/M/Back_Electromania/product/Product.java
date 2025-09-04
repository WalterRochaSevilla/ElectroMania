package com.W.M.Back_Electromania.product;

import jakarta.persistence.Basic;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "productos")
public class Product {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long id;
    @Basic
    @Column(name = "nombre", nullable = false)
    private String name;
    @Column(name = "descripcion", nullable = false)
    private String description;
    @Column(name = "precio", nullable = false)
    private Double price;
    @Column(name = "stock", nullable = false)
    private Integer stock;
    @Column(name = "imagen_url", nullable = false)
    private String image;
    @Column(name = "activo", nullable = false)
    private Integer active;
}
