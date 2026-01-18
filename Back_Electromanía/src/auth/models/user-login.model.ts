import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserLoginRequestModel {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    @ApiProperty({
        title: 'email',
        description: 'Correo electronico del usuario',
        type: String,
        required: true,
        example: 'prueba@gmail.com'
    })
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    @ApiProperty({
        title: 'password',
        description: 'Contraseña del usuario',
        type: String,
        required: true,
        example: 'password'
    })
    password: string;
}