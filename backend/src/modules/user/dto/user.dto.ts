import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'The first name of the user',
    maxLength: 45,
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  firstname: string;

  @ApiProperty({
    description: 'The last name of the user',
    maxLength: 45,
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  lastname: string;

  @ApiProperty({
    description: 'The email address of the user',
    maxLength: 60,
    example: 'john@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(60)
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    maxLength: 45,
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  password: string;

  @ApiProperty({
    description: "The URL to the user's profile picture",
    maxLength: 150,
    example: 'https://example.com/profile-pic.jpg',
  })
  @IsOptional()
  @MaxLength(150)
  profile_pic: string;

  @ApiProperty({
    description: 'The date and time of user insertion',
    type: Date,
    example: '2024-02-25T12:00:00Z',
  })
  @IsOptional()
  date_time_insert: Date;

  @ApiProperty({
    description: 'Flag to indicate if the user is enabled',
    example: 1,
  })
  @IsOptional()
  enable: number;
}
