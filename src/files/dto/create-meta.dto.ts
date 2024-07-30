import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

export class CreateMetaDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    rowCount: number;

    @IsObject()
    colUniqueCount: object;
}