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
import { RoleDto } from '../../dto/roles.dto';
import { Roles } from '../../entities/roles.entity';
import { RolesService } from '../../service/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: RoleDto): Promise<Roles> {
    try {
      return await this.rolesService.create(createRoleDto);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create role');
    }
  }

  @Get()
  async findAll(): Promise<Roles[]> {
    try {
      return await this.rolesService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch roles');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Roles> {
    try {
      const role = await this.rolesService.findOne(+id);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch role');
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: RoleDto,
  ): Promise<Roles> {
    try {
      const role = await this.rolesService.update(+id, updateRoleDto);
      if (!role) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update role');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    try {
      const deleted: any = await this.rolesService.remove(+id);
      if (!deleted) {
        throw new NotFoundException('Role not found');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete role');
    }
  }
}
