package com.W.M.Back_Electromania.product;


import org.springframework.boot.context.properties.bind.DefaultValue;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Builder.Default;

public record ProductAddStockByIdRequest(
    @NotBlank(message = "Id is required")
    Long id,

    @Positive
    @DefaultValue("1")
    Integer stock
) {
    // public ProductAddStockByIdRequest(Long id) {
    //     this(id, 1);
    // }
}