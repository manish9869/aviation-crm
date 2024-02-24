import { HttpModule } from '@nestjs/axios';
import { Logger, Module } from '@nestjs/common';
import { HttpServiceProviders } from './http-service-providers';
@Module({
  imports: [HttpModule],
  providers: [HttpServiceProviders, Logger],
  exports: [HttpServiceProviders],
})
export class HttpServiceModule {}
