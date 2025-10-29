import { Injectable } from '@nestjs/common';
import { Product } from '../entity/Product.entity';
import { ProductMapper } from '../mapper/Product.mapper';
<<<<<<< HEAD
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
=======
import { ProductModel } from '../model/Product.model';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterProductImageRequestModel } from '../model/RegisterProductImageRequest.model';
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
import { PageProductMapper } from '../mapper/PageProduct.mapper';
import { PageProductResponseModel } from '../model/PageProductResponse.model';
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
import { ProductImage } from '../entity/ProdctImage.entity';


@Injectable()
export class ProductService {
    productMapper = new ProductMapper();
    productImageMapper= new ProductImageMapper();
<<<<<<< HEAD
=======
    pageProductMapper = new PageProductMapper();
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
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
<<<<<<< HEAD
        return this.productRepository.find().then(products => products.map(product => this.productMapper.toModel(product)));
=======
        const promise = this.productRepository.find();
        const products = promise.then(products => products.map(product => this.productMapper.toModel(product)));
        return products;
    }


    getPageProduct(page: number): Promise<PageProductResponseModel> {
        const products = this.getPage(page);
        return products.then(products => this.pageProductMapper.toResponse(page, products));
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
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
<<<<<<< HEAD
=======
    private getPage(page: number): Promise<ProductModel[]> {
        const promise = this.productRepository.find({skip: (page - 1) * 20, take: 20});
        const products = promise.then(products => products.map(product => this.productMapper.toModel(product)));
        return products;
    }
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
}
