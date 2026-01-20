import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateProductRequestModel } from '../model/CreateProductRequest.model';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService,PrismaService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    const prisma = module.get(PrismaService);
    await prisma.cartDetails.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.category.deleteMany();
    await prisma.product.deleteMany();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it("Deberia obtener todos los productos", async () => {
    const newProduct = await service.createProduct({
      product_name: 'prueba',
      description: 'prueba',
      price: 100,
      stock: 10
    } as CreateProductRequestModel)
    const products = await service.getAllProducts();
    expect(products.length).toBeGreaterThan(0);
  });
  it("Deberia obtener un producto valido", async () => {
    const newProduct = await service.createProduct({
      product_name: 'prueba',
      description: 'prueba',
      price: 100,
      stock: 10
    } as CreateProductRequestModel)
    const products = await service.getAllProducts();
    expect(products[0].product_id).toBe(newProduct.product_id);
  });
  it("Deberia crear un producto", async () => {
    const newProduct = await service.createProduct({
      product_name: 'prueba',
      description: 'prueba',
      price: 100,
      stock: 10
    } as CreateProductRequestModel)
    expect(newProduct).toBeDefined();
  })
  it("Deberia actualizar un producto", async () => {
    const newProduct = await service.createProduct({
      product_name: 'prueba',
      description: 'prueba',
      price: 100,
      stock: 10
    } as CreateProductRequestModel)
    const searchProduct = await service.getFilterBy({product_id: newProduct.product_id});
    const updateData: CreateProductRequestModel = {
      product_name: 'prueba',
      description: 'prueba',
      price: 200,
      stock: 8
    }
    const updatedProduct = await service.updateProduct(searchProduct[0].product_id, updateData);
    expect(updatedProduct).toBeDefined();
  })
});
