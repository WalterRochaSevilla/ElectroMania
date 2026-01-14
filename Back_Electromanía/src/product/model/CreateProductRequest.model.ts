import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateProductRequestModel {
    @IsString()
    @ApiProperty({
        title: "name",
        description: "Nombre del Producto",
        type: String
    })
    name: string;
    @IsString()
    @ApiProperty({
        title:"description",
        description: "Descripcion del Producto",
        type: String
    })
    description: string;
    @IsNumber()
    @ApiProperty({
        title: "price",
        description: "Precio del Producto",
        type: Number
    })
    price: number;
    @IsNumber()
    @ApiProperty({
        title: "stock",
        description: "Stock del Producto",
        type: Number
    })
    stock: number;
}