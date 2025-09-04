package com.W.M.Back_Electromania.product;

import org.springframework.boot.context.properties.bind.DefaultValue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public record ProductAddStockByNameRequest(
    @NotBlank(message = "Name is required")
    String name,
    @DefaultValue("1")
    @Positive
    Integer stock
) {
    
}
