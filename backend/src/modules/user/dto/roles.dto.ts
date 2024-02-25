import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RoleDto {
  @ApiProperty({
    description: 'The name of the role',
    type: String,
    maxLength: 45,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  role_name: string;

  @ApiProperty({
    description: 'The description of the role',
    type: String,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  role_description: string;
}
