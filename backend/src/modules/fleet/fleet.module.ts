import { Module } from '@nestjs/common';
import { HttpServiceModule } from 'src/http-service/http-service.module';
import { AirportController } from './controller/airport/airport.controller';
import { AirportService } from './service/airport.service';
import { Airport } from './controller/entities/airport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HttpServiceModule, TypeOrmModule.forFeature([Airport])],
  controllers: [AirportController],
  providers: [AirportService],
  exports: [AirportService],
})
export class FleetModule {}
