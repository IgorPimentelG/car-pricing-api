import {
    IsString,
    IsNumber,
    Min,
    Max,
    IsLongitude,
    IsLatitude
} from "class-validator";


export class CreateReportDTO {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @IsNumber()
    @Min(1930)
    @Max(2050)
    year: number;

    @IsNumber()
    @Min(0)
    @Max(100000)
    mileage: number;

    @IsLatitude()
    lat: number;

    @IsLongitude()
    lng: number;

    @IsNumber()
    @Min(0)
    @Max(1000000)
    price: number;
}