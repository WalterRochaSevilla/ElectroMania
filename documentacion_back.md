# 📄 Guía de Desarrollo Backend – Electromanía

1. Resumen del Proyecto
    Electromanía será una plataforma web de venta de componentes electrónicos con dos vistas principales:
        - Vista Administrativa (Backoffice): Control de inventario, gestión de productos, usuarios y facturación.
        - Vista Cliente: Catálogo de productos con precios, disponibilidad y características; carrito de compras; generación y envío de facturas por correo electrónico.

La facturación estará basada en la ley boliviana, considerando NIT o CI y Razón Social del cliente.

2. Alcance Backend
    - API REST para comunicación con el frontend Angular.
    - Autenticación y autorización con JWT.
    - Gestión de productos (CRUD).
    - Gestión de usuarios (registro, login, roles).
    - Carrito de compras y proceso de pago simulado (integración futura con pasarela real).
    - Generación de facturas en PDF y envío por correo.
    - Registro en base de datos de ventas, detalles de factura e inventario.
    - Endpoints protegidos por roles (ADMIN y CLIENTE).

3. Dependencias de Spring Boot
Generadas con Spring Initializr:

    - Spring Web
    - Spring Data JPA
    - MySQL Driver
    - Spring Security
    - Spring Boot DevTools
    - Validation
    - Java Mail Sender (equivalente a Spring Mail)
    - Lombok
    - Spring Boot Actuator

4. Arquitectura Técnica
    ``` mermaid
        graph TD
            A[Frontend Angular] -->|HTTP JSON| B[API REST Spring Boot]
            B -->|JPA/Hibernate| C[MySQL Database]
            B -->|SMTP| D[Servidor de Correo]
            B -->|JWT| A
    ```
5. Estructura de la Base de Datos
    ```sql
    CREATE TABLE usuarios (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        nit_ci VARCHAR(50),
        razon_social VARCHAR(100),
        rol ENUM('ADMIN', 'CLIENTE') DEFAULT 'CLIENTE'
    );

    CREATE TABLE productos (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        precio DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL,
        categoria VARCHAR(100),
        imagen_url VARCHAR(255)
    );

    CREATE TABLE facturas (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        usuario_id BIGINT NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    );

    CREATE TABLE detalle_factura (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        factura_id BIGINT NOT NULL,
        producto_id BIGINT NOT NULL,
        cantidad INT NOT NULL,
        precio_unitario DECIMAL(10,2) NOT NULL,
        FOREIGN KEY (factura_id) REFERENCES facturas(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
    );
    ```
6. Endpoints Sugeridos
    - Autenticación

        - POST /api/auth/register → Registro de usuario
        - POST /api/auth/login → Login y generación de JWT

    - Usuarios (ADMIN)
        - *No implementado en frontend actualmente (Gestión simulada)* TODO!

    - Productos
        - GET /api/products/all → Listar productos (Implementado y en uso)
        - GET /api/products/{id} → Detalle de producto (Disponible)
        - POST /api/products/register (ADMIN) → Crear producto (Implementado y en uso)
        - PUT /api/products/update/?id={id} (ADMIN) → Actualizar producto (Implementado y en uso)
        - DELETE /api/products/delete/{id} (ADMIN) → Eliminar producto (Implementado y en uso)

    - Carrito y Facturación
        - *Lógica mantenida en frontend (localStorage) por el momento.* (todo por seguridad a mover!)

7. Configuración de Correo
    En application.properties:
    ``` properties
    spring.mail.host=smtp.gmail.com
    spring.mail.port=587
    spring.mail.username=tu_correo@gmail.com
    spring.mail.password=tu_password_app
    spring.mail.properties.mail.smtp.auth=true
    spring.mail.properties.mail.smtp.starttls.enable=true
    ```
8. Seguridad y JWT
    - Uso de Spring Security con filtros JWT.
    - Roles: ADMIN y CLIENTE.
    - Endpoints públicos: /api/auth/** y /api/productos (GET).
    - Endpoints privados: todos los demás.

9. Estado Actual de Integración (Frontend)
    - **Autenticación**: Integrada y funcional (Login/Registro con JWT).
    - **Productos**:
        - Listado público (`GET /products/all`).
        - Creación (`POST /products/register`).
        - Actualización (`PUT /products/update/?id=XXX`).
        - Eliminación (`DELETE /products/delete/XXX`).
    - **Servicios Frontend**:
        - `AuthService`: Gestiona login, registro, logout y decodificación de tokens.
        - `ProductosService`: Centraliza todas las llamadas API de productos.

10. Entregables esperados del Backend
    -  API REST documentada con Swagger.
    - Scripts SQL iniciales.
    - Configuración para despliegue en servidor local o nube.
    - Tests unitarios básicos.

