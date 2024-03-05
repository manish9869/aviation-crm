import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Privileges } from '../../entities/privileges.entity';
import { PrivilegesService } from '../../service/privileges/privileges.service';

@Controller('privileges')
export class PrivilegesController {
  constructor(private readonly privilegesService: PrivilegesService) {}

  @Post()
  async create(
    @Body() privilegesData: Partial<Privileges>,
  ): Promise<Privileges> {
    return await this.privilegesService.createOrUpdate(privilegesData);
  }

  @Get('/role/:id')
  async findPrivilegesByRole(@Param('id') id: number): Promise<Privileges> {
    console.log('roleId', id);
    return await this.privilegesService.findPrivilegesByRole(id);
  }

  @Get()
  async findAll(): Promise<Privileges[]> {
    return await this.privilegesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Privileges> {
    return await this.privilegesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() privilegesData: Partial<Privileges>,
  ): Promise<Privileges> {
    return await this.privilegesService.update(id, privilegesData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    await this.privilegesService.remove(id);
  }
}
