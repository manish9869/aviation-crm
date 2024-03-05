import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class BookingDto {
  @IsString()
  @IsOptional()
  fbo_name: string;

  @IsOptional()
  fleet: number;

  @IsOptional()
  user: number;

  @IsOptional()
  currency: number;

  @IsString()
  @IsOptional()
  initial_date: Date;

  @IsString()
  @IsOptional()
  initial_time: string;

  @IsString()
  @IsOptional()
  departure_date: Date;

  @IsString()
  @IsOptional()
  departure_time: string;

  @IsOptional()
  numpax: number;

  @IsString()
  @IsOptional()
  price_full_aircraft: string;

  @IsString()
  @IsOptional()
  price_per_seat: string;

  @IsString()
  @IsOptional()
  app_amenities_detail: string;

  @IsOptional()
  airport_source: number;

  @IsString()
  @IsOptional()
  fbo_source: string;

  @IsOptional()
  airport_destination: number;

  @IsString()
  @IsOptional()
  fbo_destination: string;
}
