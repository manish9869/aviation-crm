import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UserTypeDto {
  @ApiProperty({
    description: 'The type of the user',
    maxLength: 45,
    example: 'Admin',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  user_type: string;

  @ApiProperty({
    description: 'The description of the user type',
    maxLength: 100,
    example: 'Administrator user',
  })
  @IsString()
  @MaxLength(100)
  user_type_description: string;
}
