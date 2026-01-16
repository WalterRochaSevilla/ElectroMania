import { Prisma } from '@prisma/client';
import { CartDetailsResponseModel } from '../models/cartDetails.model';
import { CreateCartRequestDto } from '../dto/createCartRequest.dto';
import { ProductMapper } from 'src/product/mapper/Product.mapper';

type CartDetailEntity = Prisma.CartDetailsGetPayload<{
  include: {
    product:{
      include: {
        productImages: true;
      }
    };
  };
}>;

export class CartDetailsMapper {
    productMapper = new ProductMapper();
  toModel(entity: CartDetailEntity): CartDetailsResponseModel {
    const model = new CartDetailsResponseModel();

    if(entity.product) {
      model.product = this.productMapper.toCartProduct(entity.product);
    }else{
        throw new Error('Product not found');
    }
    model.quantity = entity.quantity;
    model.total = Number(entity.sub_total);

    return model;
  }

//   // ✅ Create DTO → Prisma input
//   toEntity(
//     dto: CreateCartRequestDto,
//   ): Prisma.CartDetailsCreateWithoutCartInput {
//     return {
//       quantity: dto.quantity,
//       unit_price: dto.unitPrice,
//       sub_total: dto.quantity * Number(dto.unitPrice),
//       product: {
//         connect: {
//           product_id: dto.productId,
//         },
//       },
//     };
//   }
}
