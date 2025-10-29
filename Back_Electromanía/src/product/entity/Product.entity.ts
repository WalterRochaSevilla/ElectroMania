import { table } from "console";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./ProdctImage.entity";
<<<<<<< HEAD
import { CartDetails } from "src/cart/entity/CartDetails.entity";
=======
import { CartDetails } from "../../cart/entity/CartDetails.entity";
>>>>>>> parent of d53a59b (Migration: Migrates Db to postgress and prisma)
import { ProductState } from "../enums/ProductState.enum";
@Entity("products")
export class Product {
    @PrimaryGeneratedColumn({type: "int", name: "product_id"})
    product_id: number;
    @Column({nullable: false, unique: true, length: 50, name: "product_name", type: "varchar"})
    product_name: string;
    @Column( {nullable: false, length: 50, name: "description", type: "varchar"})
    description: string;
    @Column({nullable: false, default: 0, type: "decimal", name: "price", precision: 10, scale: 2})
    price: number;
    @Column({nullable: false, default: 0, type: "int", name: "stock"})
    stock: number;
    @Column({nullable: false, default: ProductState.AVAILABLE, type: "enum", enum: ProductState, name: "state"})
    state: ProductState
    @OneToMany(type=>ProductImage, productImage=>productImage.product)
    productImages: ProductImage[]
    @ManyToMany(type=>CartDetails, cartDetails=>cartDetails.product_id)
    cartDetails: CartDetails[]
}