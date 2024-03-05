import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class AirportemptylegbookingDto {
  @IsOptional()
  airport_source: string;

  @IsOptional()
  fbo_source: string;

  @IsOptional()
  airport_destination: string;

  @IsOptional()
  fbo_destination: string;

  @IsOptional()
  sourceflight: string;

  @IsOptional()
  destinationflight: string;
}
