import { Column, Entity, ForeignKey, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product.entity";
@Entity("product_images")
export class ProductImage {
    @Column({primary: true,nullable: false, type: "int", name: "product_id",foreignKeyConstraintName: " product_id"})
    product_id: number
    @Column({primary: true, nullable: false,type: "varchar",length: 100})
    image: string;

    @ManyToOne(type => Product, product => product.productImages)
    @JoinColumn({name: "product_id"})
    product: Product
    
}