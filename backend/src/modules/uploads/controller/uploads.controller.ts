import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs';
import { diskStorage } from 'multer';
import { FILE_FOLDERS } from 'src/constants/common';

@Controller('media')
export class UploadsController {
  constructor() {}

  @Post('upload')
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: FILE_FOLDERS.MEDIA_FILES,
        filename: (req, file, cb) => {
          const timestamp = new Date().getTime(); // get current timestamp
          const fileExtension = file.originalname.split('.').pop(); // get file extension
          const filename = `${timestamp}.${fileExtension}`; // create filename with timestamp
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const SERVER_URL = process.env.SERVER_URL;
    const uploadedFiles = files.map((file) => ({
      filename: file.filename,
      path: `${SERVER_URL}/${FILE_FOLDERS.SERVER_LOCATION}/${file.filename}`,
      extension: file.originalname.split('.').pop(), // get file extension
    }));
    return uploadedFiles;
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    try {
      const filePath = `${FILE_FOLDERS.MEDIA_FILES}/${filename}`; // Construct file path
      unlink(filePath, (error) => {
        // Call unlink function with callback
        if (error) {
          // Handle error if file deletion fails
          return { error: 'Failed to delete file', details: error.message };
        }
        return { message: 'File deleted successfully' };
      });
    } catch (error) {
      // Handle error if there's an issue with unlink function
      return { error: 'Failed to delete file', details: error.message };
    }
  }
}
