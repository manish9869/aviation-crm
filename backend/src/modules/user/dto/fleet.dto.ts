import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class FleetDto {

  @ApiProperty({
    description: 'The tail number of the fleet',
    maxLength: 10,
    example: 'ABC123',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  tail_number: string;

  @ApiProperty({
    description: 'The speed of the fleet in knots',
    example: 500,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  knots_speed: number;

  @ApiProperty({
    description: 'The maximum range of the fleet in nautical miles',
    example: 2000,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  max_range_nm: number;

  @ApiProperty({
    description: 'The number of passengers the fleet can accommodate',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  pax_number: number;

  @ApiProperty({
    description: 'The brand of the fleet',
    maxLength: 45,
    example: 'Airbus',
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  brand: string;

  @ApiProperty({
    description: 'The model of the fleet',
    maxLength: 45,
    example: 'A320',
  })
  @IsOptional()
  @IsString()
  @MaxLength(45)
  model: string;

  @ApiProperty({
    description: 'The URL of the interior photo of the fleet',
    maxLength: 150,
    nullable: true,
  })
  @IsOptional()
  @MaxLength(150)
  photo_interior: string;

  @ApiProperty({
    description: 'The URL of the exterior photo of the fleet',
    maxLength: 150,
    nullable: true,
  })
  @IsOptional()
  @MaxLength(150)
  photo_exterior: string;

  @ApiProperty({
    description: 'The price per hour of the fleet',
    example: '150.00',
    nullable: true,
  })
  @IsOptional()
  hour_price: string;

  @ApiProperty({
    description: 'The year of manufacture of the fleet',
    example: 2020,
  })
  @IsNumber()
  @IsOptional()
  yom: number;

  @ApiProperty({
    description: 'The date and time of fleet insertion',
    type: Date,
    example: '2024-02-25T12:00:00Z',
  })
  @IsOptional()
  date_time_insert: Date;

}
