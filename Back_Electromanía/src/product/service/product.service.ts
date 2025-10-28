import { Injectable } from '@nestjs/common';
import { Product } from '../entity/Product.entity';
import { ProductMapper } from '../mapper/Product.mapper';
import { ProductModel } from '../model/Product.model';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
import { PageProductMapper } from '../mapper/PageProduct.mapper';
import { PageProductResponseModel } from '../model/PageProductResponse.model';
import { ProductImage } from '../entity/ProdctImage.entity';


@Injectable()
export class ProductService {
    productMapper = new ProductMapper();
    productImageMapper= new ProductImageMapper();
    pageProductMapper = new PageProductMapper();
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>
    ){
    }


    registerProduct(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }

    createProduct(product: CreateProductRequestModel): Promise<Product> {
        const entity = this.productMapper.toEntity(product);
        return this.registerProduct(entity);
    }

    getAllProducts(): Promise<ProductModel[]> {
        const promise = this.productRepository.find();
        const products = promise.then(products => products.map(product => this.productMapper.toModel(product)));
        return products;
    }


    getPageProduct(page: number): Promise<PageProductResponseModel> {
        const products = this.getPage(page);
        return products.then(products => this.pageProductMapper.toResponse(page, products));
    }

    getfilterBy(filter: any): Promise<ProductModel[]> {
        return this.productRepository.find(filter).then(products => products.map(product => this.productMapper.toModel(product)));
    }
    updateProduct(product: Product): Promise<Product> {
        return this.productRepository.save(product);
    }


    registerProductImage(productImage: RegisterProductImageRequestModel): Promise<ProductImage> {
        let product = this.productRepository.findOne({where: {product_name: productImage.name},relations: ['productImages']});
        return product.then(product => {
            if(product){
                return this.productImageRepository.save(this.productImageMapper.toEntity(productImage,product));
            }else{
                throw new Error('Product Not Found');
            }
        });
    }
    private getPage(page: number): Promise<ProductModel[]> {
        const promise = this.productRepository.find({skip: (page - 1) * 20, take: 20});
        const products = promise.then(products => products.map(product => this.productMapper.toModel(product)));
        return products;
    }
}
