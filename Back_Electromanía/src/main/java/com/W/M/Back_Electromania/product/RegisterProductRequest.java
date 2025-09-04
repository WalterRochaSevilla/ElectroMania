package com.W.M.Back_Electromania.product;

import org.springframework.boot.context.properties.bind.DefaultValue;

import jakarta.validation.constraints.NotBlank;

public record RegisterProductRequest(

    @NotBlank(message = "Name is required")
    String name,
    @NotBlank(message = "Description is required")
    String description,
    @NotBlank(message = "Price is required")
    Double price,
    @NotBlank(message = "Stock is required")
    Integer stock,
    @NotBlank(message = "Image is required")
    String image,
    @DefaultValue("1")
    Integer active
) {
}
