package com.W.M.Back_Electromania.product;

import org.springframework.data.util.Pair;

import lombok.Getter;


@Getter
public class UpdateProductRequestHandler {
    private Pair<Boolean, Long> id;
    private Pair<Boolean, String> name;
    private Pair<Boolean, Integer> stock;
    public UpdateProductRequestHandler(ProductAddStockByIdRequest request) {
        this.id = Pair.of(true, request.id());
        this.stock = Pair.of(true, request.stock());
    }
    public UpdateProductRequestHandler(ProductAddStockByNameRequest request) {
        this.name = Pair.of(true, request.name());
        this.stock = Pair.of(true, request.stock());
    }
    public boolean haveId(){
        return id.getFirst();
    }
    public boolean haveName(){
        return name.getFirst();
    }
    public boolean haveStock(){
        return stock.getFirst();
    }
}
