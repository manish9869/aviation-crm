import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CurrencyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  currencyName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  currencyAbbreviation: string;
}
