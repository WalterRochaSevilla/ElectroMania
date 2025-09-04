package com.W.M.Back_Electromania.product;

import lombok.Getter;

public record ProductUpdatePriceRequest(Long id, Double price) {
    public ProductUpdatePriceRequest( Long id, Double price) {
        if (id == null) {
            throw new NullPointerException("El id no puede ser nulo");
        }else if (price == null) {
            throw new NullPointerException("El precio no puede ser nulo");
        }
        this.id = id;
        this.price = price;
    }
}