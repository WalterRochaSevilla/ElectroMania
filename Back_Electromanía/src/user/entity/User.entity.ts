import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../enums/UserRole.enum";
import { Cart } from "src/cart/entity/Cart.entity";
import { UserState } from "../enums/UserState.enum";

@Entity("users")
export class User {    

    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({nullable: false, length: 50, name: "name", type: "varchar"})
    name: string;

    @Column({nullable: false, unique: true, length: 50, name: "email", type: "varchar"})
    email: string;

    @Column({nullable: false, length: 60, name: "password", type: "varchar"})
    password: string;

    @Column({nullable: false, default: UserRole.USER, type: "enum", enum: UserRole, name: "role"})
    role: UserRole

    @Column({nullable: false, length: 10, name: "nit_ci", type: "varchar"})
    nit_ci: string

    @Column({nullable: false, length: 50, name: "social_reason", type: "varchar"})
    social_reason: string

    @Column({nullable: false, default: UserState.ACTIVE, type: "enum", enum: UserState, name: "state"})
    is_active: UserState

    @ManyToMany(type => Cart, cart => cart.users)
    carts: Cart[]
}
