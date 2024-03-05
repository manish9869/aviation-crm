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
import { Currency } from './entities/currency.entity';
import { CurrencyController } from './controller/currency/currency.controller';
import { CategoryController } from './controller/category/category.controller';
import { CurrencyService } from './service/currency/currency.service';
import { CategoryService } from './service/category/category.service';
import { Category } from './entities/category.entity';
import { Fleet } from './entities/fleet.entity';
import { FleetService } from './service/fleet/fleet.service';
import { FleetController } from './controller/fleet/fleet.controller';
import { EmptylegController } from './controller/emptyleg/emptyleg.controller';
import { EmptylegService } from './service/emptyleg/emptyleg.service';
import { Emptyleg } from './entities/emptyleg.entity';
import { AirportEmptylegControlService } from './service/airportemptylegcontrol/airportemptylegcontrol.service';
import { AirportEmptylegControl } from './entities/airportemptylegcontrol.entity';
@Module({
  imports: [
    HttpServiceModule,
    TypeOrmModule.forFeature([
      Roles,
      UserType,
      User,
      Seller,
      Currency,
      Category,
      Fleet,
      Emptyleg,
      AirportEmptylegControl
    ]),
  ],
  controllers: [
    RolesController,
    UserController,
    UserTypeController,
    SellerController,
    CurrencyController,
    CategoryController,
    FleetController,
    EmptylegController,
  ],
  providers: [
    Logger,
    RolesService,
    UserService,
    UserTypeService,
    SellerService,
    CurrencyService,
    CategoryService,
    FleetService,
    EmptylegService,
  AirportEmptylegControlService,
  ],
  exports: [
    RolesService,
    UserService,
    UserTypeService,
    SellerService,
    CurrencyService,
    CategoryService,
    FleetService,
    EmptylegService,
    AirportEmptylegControlService
  ],
})
export class UserModule {}
