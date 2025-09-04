package com.W.M.Back_Electromania.product;

import static org.junit.jupiter.api.Assertions.*;
import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@DisplayName("Test de solicitud de actualización de precio de producto")
class ProductUpdatePriceRequestTest {
    @Test
    @DisplayName("Deberia devolver una excepcion null si el id es nulo")
    void deberiaFallarSiElIdEsNulo() {
        assertThatThrownBy(()-> new ProductUpdatePriceRequest(null, 1000.0))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El id no puede ser nulo");
    }
    

}
