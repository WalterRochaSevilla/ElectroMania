package com.W.M.Back_Electromania.product;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
    public boolean existsByName(String name) {
        return productRepository.findByName(name) != null;
    }
    public ResponseEntity<Product> registeProduct(RegisterProductRequest request) {
        return existsByName(request.name()) ? ResponseEntity.badRequest().build() : ResponseEntity.ok().body(saveProduct(new Product(null,request.name(),request.name(),request.price(),request.stock(),request.image(),request.active())));
    }
    public ResponseEntity<Product> updateProduct(UpdateProductRequestHandler request) {
        Product product = request.haveId() ? productRepository.findById(request.getId().getSecond()).get(): productRepository.findByName(request.getName().getSecond());
        if (product == null) return ResponseEntity.notFound().build();
        if (request.haveStock()) product.setStock(product.getStock() + request.getStock().getSecond());
        return saveProduct(product) != null ? ResponseEntity.ok().body(saveProduct(product)) : ResponseEntity.badRequest().build();
    }
}
