import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AirportDto {
  @IsNotEmpty()
  @IsString()
  airportname: string;

  @IsNotEmpty()
  @IsString()
  airportiatacode: string;

  @IsNotEmpty()
  @IsString()
  airporticaocode: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  countryname: string;
}
