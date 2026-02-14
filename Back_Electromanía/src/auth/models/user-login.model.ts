import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { SerializeOptions } from "@nestjs/common";

export class UserLoginRequestModel {
    @IsNotEmpty({message: "El email no puede estar vacio"})
    @IsString({message: "El email debe ser un string"})
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