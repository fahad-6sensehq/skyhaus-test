import {
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    hello() {
        return 'Hello World';
    }

    @Post('video')
    @UseInterceptors(FileInterceptor('file'))
    async uploadVideo(@UploadedFile() file: Express.Multer.File) {
        return await this.appService.uploadVideo(file);
    }

    @Get('video')
    async getAllVideos() {
        return await this.appService.getAllVideos();
    }

    @Get('video/:id')
    async getVideo(@Param('id') id: string) {
        return await this.appService.getVideo(id);
    }

    @Get('me')
    async me() {
        return await this.appService.me();
    }

    @Get('me/id')
    async getAnAccount(@Param('id') id: string) {
        return await this.appService.getAnAccount(id);
    }
}
