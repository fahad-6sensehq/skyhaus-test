import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AwsServices } from './common/AWS.helper';
import { Video } from './common/video.schema';
import { appConfig } from './common/config';

const token = appConfig.token;

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
    ) {}

    async uploadVideo(file: Express.Multer.File) {
        const s3Response = await AwsServices.S3.uploadFile(file);

        if (s3Response == -1) {
            return {
                error: 'FILE TYPE NOT ALLOWED',
            };
        }

        const body = {
            name: file.fieldname,
            key: s3Response.Key,
            status: 'active',
            link: s3Response.Location,
        };

        return await this.videoModel.create(body);
    }

    async getAllVideos() {
        return await this.videoModel.find();
    }

    async getVideo(id: string) {
        const oid = new Types.ObjectId(id);
        return await this.videoModel.findById(oid);
    }

    async me() {
        const resp = await fetch(`https://api.frame.io/v2/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await resp.text();
        console.log(data);

        return data;
    }

    async getAnAccount(id: string) {
        const resp = await fetch(`https://api.frame.io/v2/accounts`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await resp.text();
        console.log(data);

        return data;
    }
}
