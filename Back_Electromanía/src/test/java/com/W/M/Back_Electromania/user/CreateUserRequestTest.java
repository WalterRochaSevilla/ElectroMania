package com.W.M.Back_Electromania.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.W.M.Back_Electromania.utils.PasswordUtils;

import jakarta.validation.Validator;

@DisplayName("Test para la creacion de un usuario")
public class CreateUserRequestTest {
    @Autowired
    private Validator validator;
    
    @Test
    @DisplayName("Deberia devolver una excepcion null si el nombre es nulo")
    void deberiaDevolverUnaExcepcionNullSiElNombreEsNulo() {
        assertThatThrownBy(() -> new UserCreateRequest(null, "email", "password", "nit_ci", "razon_social"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El nombre no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver una excepcion si el email es nulo")
    void deberiaDevolverUnaExcepcionSiElEmailEsNulo() {
        assertThatThrownBy(() -> new UserCreateRequest("nombre",null, "password", "nit_ci", "razon_social"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El email no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver una excepcion si el password es nulo")
    void deberiaDevolverUnaExcepcionSiElPasswordEsNulo() {
        assertThatThrownBy(() -> new UserCreateRequest("nombre","email", null, "nit_ci", "razon_social"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El password no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver una excepcion si el nit_ci es nulo")
    void deberiaDevolverUnaExcepcionSiElNitCiEsNulo() {
        assertThatThrownBy(() -> new UserCreateRequest("nombre","email", "password", null, "razon_social"))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("El nit_ci no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver una excepcion si la razon_social es nulo")
    void deberiaDevolverUnaExcepcionSiLaRazonSocialEsNulo() {
        assertThatThrownBy(() -> new UserCreateRequest("nombre","email", "password", "nit_ci", null))
        .isInstanceOf(NullPointerException.class)
        .hasMessage("La razon_social no puede ser nulo");
    }
    @Test
    @DisplayName("Deberia devolver un Usuario valido")
    void deberiaDevolverUnUsuarioValido() {
        UserCreateRequest userCreateRequest = new UserCreateRequest("nombre","email", "password", "nit_ci", "razon_social");
        CreateUserRequestHandler handler = new CreateUserRequestHandler(userCreateRequest);
        User user = new User(null,"nombre", "email", handler.getPassword(), "nit_ci", "razon_social", true, Rol.CLIENTE);
        assertThat(user).isEqualTo(handler.toUser());
    }
    @Test
    @DisplayName("Deberia devolver un Admin valido")
    void deberiaDevolverUnAdminValido() {
        AdminCreateRequest userCreateRequest = new AdminCreateRequest("nombre","email", "password", "nit_ci", "razon_social");
        CreateUserRequestHandler handler = new CreateUserRequestHandler(userCreateRequest);
        User user = new User(null,"nombre", "email", handler.getPassword(), "nit_ci", "razon_social", true, Rol.ADMIN);
        assertThat(user).isEqualTo(handler.toUser());
    }
}
