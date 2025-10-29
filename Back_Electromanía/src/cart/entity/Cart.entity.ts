import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { CartState } from "../enums/CartState.enum";
import { User } from "src/user/entity/User.entity";
import { CartDetails } from "./CartDetails.entity";


@Entity("cart")
export class Cart{

    @Column({primary: true, nullable: false,type: "int",name: "cart_id",unsigned: true})
    cart_id: number;

    @Column({ nullable: false,type: "varchar",length: 100})
    user_uuid: string

    @Column({nullable: false, default: CartState.ACTIVE, type: "enum", enum: CartState, name: "state"})
    state: CartState

    @Column({nullable: false, type: "datetime", name: "created_at"})
    created_at: string
    @ManyToMany(type => User, user => user.carts)
    users: User[]
    @OneToMany(type=>CartDetails, cartDetails=>cartDetails.cart_id)
    cartDetails: CartDetails[]
}