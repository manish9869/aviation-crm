import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsController } from './controller/uploads.controller';
import { FILE_FOLDERS } from 'src/constants/common';

@Module({
  imports: [
    MulterModule.register({
      dest: FILE_FOLDERS.MEDIA_FILES, // Destination folder for uploaded files
    }),
  ],
  providers: [],
  controllers: [UploadsController],
})
export class UploadsModule {}
