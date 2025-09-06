package com.W.M.Back_Electromania.user;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.*;
import jakarta.validation.Validator;

@DisplayName("Solicitudes de actualizacion de usuarios")
public class UpdateUserRequestTest {
    @Autowired
    private Validator validator;

    @Test
    @DisplayName("Deberia devolver una excepcion si la email es nulo al actualizar la contraseña")
    void deberiaDevolverUnaExcepcionSiElEmailEsNulo() {
        assertThatThrownBy(() -> new UserUpdatePasswordRequest(null,"passwordNew1234%"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El email no puede ser nulo");
    }

    @Test
    @DisplayName("Deberia devolver una excepcion si la password es nulo al actualizar la contraseña")
    void deberiaDevolverUnaExcepcionSiLaPasswordEsNulo() {
        assertThatThrownBy(() -> new UserUpdatePasswordRequest("email",null))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El password no puede ser nulo");
    }

    @Test
    @DisplayName("Deberia devolver una excepcion si el correo electronico no es valido al actualizar el nit")
    void deberiaDevolverUnaExcepcionSiElCorreoElectronicoNoEsValido() {
        assertThatThrownBy(() -> new UserUpdateNitRequest("email",null,"razon_social"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El nit no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver una excepcion si la razon social no es valida al actualizar el nit")
    void deberiaDevolverUnaExcepcionSiLaRazonSocialNoEsValida() {
        assertThatThrownBy(() -> new UserUpdateNitRequest("email","nit_ci",null))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("La razon social no puede ser nulo");
    }
}
