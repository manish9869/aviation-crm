import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class EmptylegDto {
  @IsOptional()
  fleet: number;

  @IsOptional()
  user: number;

  @IsOptional()
  currency: number;

  @IsOptional()
  initial_date: Date;

  @IsOptional()
  initial_time: String;

  @IsOptional()
  departure_date: Date;

  @IsOptional()
  departure_time: String;

  @IsNumber()
  @IsOptional()
  numpax: number;

  @IsString()
  @IsOptional()
  price_full_aircraft: string;

  @IsString()
  @IsOptional()
  price_per_seat: string;

  @IsOptional()
  app_amenities_detail: string;
}
