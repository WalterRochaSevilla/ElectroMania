import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ProductMapper } from '../mapper/Product.mapper';
import { ProductImageMapper } from '../mapper/ProductImage.mapper';
import { ProductImage } from '../entity/ProdctImage.entity';


@Injectable()
export class ProductService {
    productMapper = new ProductMapper();
    productImageMapper= new ProductImageMapper();
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>
    ){
    }

    const imageData = this.productImageMapper.toEntity(dto, product);

    await this.prisma.productImage.create({ data: imageData });

    const updated = await this.prisma.product.findUnique({
      where: { product_id: product.product_id },
      include: { productImages: true },
    });

    getAllProducts(): Promise<ProductModel[]> {
        return this.productRepository.find().then(products => products.map(product => this.productMapper.toModel(product)));
    }

    return products.map((p) => this.productMapper.toModel(p));
  }

  async updateProduct(
    productId: number,
    dto: Partial<CreateProductRequestModel>,
  ): Promise<ProductModel> {
    const updated = await this.prisma.product.update({
      where: { product_id: productId },
      data: dto,
      include: { productImages: true },
    });

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
}
