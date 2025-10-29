import { Mapper } from "src/common/interfaces/Mapper.interface";
import { User } from "../entity/User.entity";
import { UserModel } from "../models/User.model";
import { UserRole } from "../enums/UserRole.enum";
import { UserCreateRequestModel } from "../models/UserCreateRequest.model";
import { Cart } from "src/cart/entity/Cart.entity";

export class UserMapper implements Mapper<UserModel, User,UserCreateRequestModel,Cart> {
    toModel(entity: User): UserModel {
        const model = new UserModel();
        model.uuid = entity.uuid;
        model.name = entity.name;
        model.email = entity.email;
        model.nit_ci = entity.nit_ci;
        model.social_reason = entity.social_reason;
        model.role = entity.role;
        return model;
    }
    toEntity(model: UserCreateRequestModel): User {
        const user = new User();
        user.name = model.name;
        user.email = model.email;
        user.password = model.password;
        user.nit_ci = model.nit_ci;
        user.social_reason = model.social_reason;
        return user;
    }
}
