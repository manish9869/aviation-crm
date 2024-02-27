import { Logger, Module } from '@nestjs/common';
import { RolesService } from './service/roles/roles.service';
import { RolesController } from './controller/roles/roles.controller';
import { Roles } from './entities/roles.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpServiceModule } from 'src/http-service/http-service.module';
import { UserType } from './entities/user-type.entity';
import { User } from './entities/user.entity';
import { UserController } from './controller/user/user.controller';
import { UserTypeController } from './controller/user-type/user-type.controller';
import { UserService } from './service/user/user.service';
import { UserTypeService } from './service/user-type/user-type.service';
import { SellerService } from './service/seller/seller.service';
import { SellerController } from './controller/seller/seller.controller';
import { Seller } from './entities/seller.entity';

@Module({
  imports: [
    HttpServiceModule,
    TypeOrmModule.forFeature([Roles]),
    TypeOrmModule.forFeature([UserType]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Seller]),
  ],
  controllers: [RolesController, UserController, UserTypeController, SellerController],
  providers: [Logger, RolesService, UserService, UserTypeService, SellerService],
  exports: [RolesService, UserService, UserTypeService, SellerService], 
})
export class UserModule {}
