import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
  IsDate,
  IsString,
} from 'class-validator';

export class SellerDto {
  @ApiProperty({ required: false }) // Use ApiProperty to customize Swagger documentation
  @IsNumber()
  @IsOptional()
  seller_id: number;

  @ApiProperty()
  seller_commerical_name: string;

  @ApiProperty()
  seller_legal_name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  tax_identification_number: string;

  @ApiProperty()
  contact_email: string;

  @ApiProperty()
  contact_name: string;

  @ApiProperty()
  contact_phone_number: string;

  @ApiProperty({ required: false }) // Mark as optional for Swagger
  @IsOptional()
  aoc_file: string;

  @ApiProperty({ required: false }) // Mark as optional for Swagger
  @IsOptional()
  legal_notary_file: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  enable: number;

  @ApiProperty({ required: false }) // Mark as optional for Swagger
  @IsOptional()
  date_time_insert: Date;
}
