import { IsJWT, IsString } from "class-validator";

export class LoginResponseModel {
    @IsString()
    @IsJWT()
    access_token: string;
    constructor(access_token: string) {
        this.access_token = access_token;
    }
}