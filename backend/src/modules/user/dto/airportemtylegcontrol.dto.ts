import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class AirportemptylegcontrolDto {
  @IsString()
  @IsOptional()
  @MaxLength(45)
  fbo_name: string;

  @IsOptional()
  airport: number;

  @IsOptional()
  flightype: number;

  @IsOptional()
  emptyleg: number;

}
