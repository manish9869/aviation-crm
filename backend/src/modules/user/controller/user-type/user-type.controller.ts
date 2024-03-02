import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    NotFoundException,
    InternalServerErrorException,
    UseGuards,
  } from '@nestjs/common';
import { UserTypeService } from '../../service/user-type/user-type.service';
import { UserType } from '../../entities/user-type.entity';

@Controller('user-type')
export class UserTypeController {
    constructor(private readonly usertypeService: UserTypeService) {}

    @Get()
  async findAll(): Promise<UserType[]> {
    try {
      return await this.usertypeService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  
}
