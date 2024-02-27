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
  @IsNumber()
  @IsOptional()
  sellerId: number;

  @IsNotEmpty()
  @IsString()
  sellerCommericalName: string;

  @IsNotEmpty()
  sellerLegalName: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  taxIdentificationNumber: string;

  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @IsNotEmpty()
  contactName: string;

  @IsNotEmpty()
  contactPhoneNumber: string;

  @IsOptional()
  aocFile: string;

  @IsOptional()
  legalNotaryFile: string;

  @IsNotEmpty()
  @IsNumber()
  enable: number;

  @IsOptional()
  dateTimeInsert: Date;
}
