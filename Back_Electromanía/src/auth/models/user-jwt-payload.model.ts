import { UserRole } from 'src/user/enums/UserRole.enum';
import { Email } from './value objects/email';
export class UserJwtPayloadModel{
    readonly uuid: string;
    readonly email: string;
    readonly role: UserRole;
    constructor(uuid: string, email: string, role: UserRole) {
        this.uuid = uuid;
        this.email = email;
        this.role = role;
    }
    toObject(){
        return{
            uuid: this.uuid,
            email: this.email,
            role: this.role
        }
    }
}