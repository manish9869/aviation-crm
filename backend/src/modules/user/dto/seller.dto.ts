import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
  IsDateString,
  IsString,
} from 'class-validator';

export class SellerDto {
  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  seller_id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seller_commercial_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  seller_legal_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tax_identification_number: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  contact_email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contact_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  contact_phone_number: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  aoc_file?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  legal_notary_file?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  enable: number;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  date_time_insert?: Date;
}
