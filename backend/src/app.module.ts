import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { AppDataSource } from './database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpServiceModule } from './http-service/http-service.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FleetModule } from './modules/fleet/fleet.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    FleetModule,
    UploadsModule,
    AuthModule,
    UserModule,
    HttpServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'media-files'), // Path to the directory where images are saved
      serveRoot: '/media-file', // URL path where images will be served
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule {}
