import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { BodyDTO } from './body.dto';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    hello() {
        return 'Hello World';
    }

    // @Post('video')
    // @UseInterceptors(FileInterceptor('file'))
    // async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    //     return await this.appService.uploadVideo(file);
    // }

    // @Get('video')
    // async getAllVideos() {
    //     return await this.appService.getAllVideos();
    // }

    // @Get('video/:id')
    // async getVideo(@Param('id') id: string) {
    //     return await this.appService.getVideo(id);
    // }

    // @Get('me')
    // async me() {
    //     return await this.appService.me();
    // }

    // @Get('me/id')
    // async getAnAccount(@Param('id') id: string) {
    //     return await this.appService.getAnAccount(id);
    // }

    // @Get('create-team')
    // async createTeam() {
    //     return await this.appService.createTeam();
    // }

    // @Get('create-asset')
    // async createAsset() {
    //     return await this.appService.createAsset();
    // }

    @Get('notion/:id')
    async notion(@Param('id') id: string) {
        return await this.appService.notion(id);
    }

    @Get('notion/page/:id')
    async getPageDetails(@Param('id') id: string) {
        return await this.appService.getPageDetails(id);
    }

    @Get('notion-search')
    async notionSearch() {
        return await this.appService.notionSearch();
    }

    @Post('create-database')
    async database(@Body() body: BodyDTO) {
        return await this.appService.database(body.name);
    }

    @Get('database/:id')
    async getDatabase(@Param('id') id: string) {
        return await this.appService.getDatabase(id);
    }

    @Get('edit-database/:id')
    async editDatabase(@Param('id') id: string) {
        return await this.appService.editDatabase(id);
    }
}
