import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { appConfig } from './common/config';
import { Video, VideoSchema } from './common/video.schema';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
            useFactory: () => ({
                uri: `${appConfig.mongodbURL}${appConfig.dbName}${appConfig.dbQuery}`,
            }),
        }),
        MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
