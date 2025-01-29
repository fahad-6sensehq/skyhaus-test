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
    ) { }

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

    async createTeam() {
        const accountId = '7f885221-28a9-4cb5-942d-6e24f95b854b';
        const resp = await fetch(
            `https://api.frame.io/v2/accounts/${accountId}/teams`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer fio-u-iz60rolbre_ybc4t64_FsaLQ3m6vWNoCDp2v3uFEbh4A3P3VKi03vL1ON4t0ArqZ'
                },
                body: JSON.stringify({
                    access: 'public',
                    account_id: '7f885221-28a9-4cb5-942d-6e24f95b854b'
                })
            }
        );

        console.log(accountId);

        const data = await resp.json();
        console.log(data);

        return data;
    }

    async createAsset() {
        const assetId = '1c24f2ac-d711-453a-9bb9-60372bf958f5';
        const resp = await fetch(
            `https://api.frame.io/v2/assets/${assetId}/children`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'file',
                    extension: '.mp4',
                    filetype: 'video/mp4',
                    is_realtime_upload: false
                })
            }
        );

        const data = await resp.json();
        console.log(data);

        return data;
    }
}
