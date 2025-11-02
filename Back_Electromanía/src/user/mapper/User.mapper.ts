import { Mapper } from "src/common/interfaces/Mapper.interface";
import { UserModel } from "../models/User.model";
import { UserCreateRequestModel } from "../models/UserCreateRequest.model";
import {User, Cart,Prisma} from "@prisma/client"

export class UserMapper implements Mapper<UserModel, User,Prisma.UserCreateInput,UserCreateRequestModel,Cart> {
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
    toEntity(model: UserCreateRequestModel): Prisma.UserCreateInput {
        return {
            name: model.name,
            email: model.email,
            password: model.password,
            nit_ci: model.nit_ci,
            social_reason: model.social_reason
        };
    }
}
