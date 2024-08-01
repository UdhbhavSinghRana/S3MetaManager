import { IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";

interface ColCountDto {
    [key: string]: number;
}

export class CreateMetaDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    rowCount: number;

    @IsObject()
    colUniqueCount: ColCountDto;
}