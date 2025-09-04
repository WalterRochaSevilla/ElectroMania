package com.W.M.Back_Electromania.product;

import lombok.Getter;

import java.util.Objects;

import javax.validation.constraints.NotNull;

public record ProductUpdatePriceRequest(
    @NotNull(message = "El id no puede ser nulo")
    Long id, 
    @NotNull(message = "El precio no puede ser nulo")
    Double price){
        public ProductUpdatePriceRequest{
            Objects.requireNonNull(id, "El id no puede ser nulo");
            Objects.requireNonNull(price, "El precio no puede ser nulo");
        }
}