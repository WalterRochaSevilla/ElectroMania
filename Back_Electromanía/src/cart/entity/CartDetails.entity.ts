import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity("cart_details")
export class CartDetails {
    @PrimaryGeneratedColumn({type: "int", name: "id"})
    id: number;

    @Column({nullable: false, type: "int", name: "cart_id"})
    cart_id: number;

    @Column({nullable: false, type: "int", name: "product_id"})
    product_id: number;

    @Column({nullable: false, type: "int", name: "quantity"})
    quantity: number;

    @Column({nullable: false, type: "decimal", name: "unit_price", precision: 10, scale: 2})
    unit_price: number

    @Column({nullable: false, type: "decimal", name: "total_price", precision: 10, scale: 2})
    sub_total: number


}