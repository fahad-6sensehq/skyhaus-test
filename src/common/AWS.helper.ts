import { S3 } from 'aws-sdk';
import * as fs from 'fs';

export class AwsServices {
    static S3 = class {
        static async uploadFile(
            file: Express.Multer.File,
        ): Promise<-1 | S3.ManagedUpload.SendData> {
            const s3: S3 = new S3({
                accessKeyId: process.env.ACCESS_KEY_ID,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION,
            });
            const bufferOg = file?.buffer ?? fs.readFileSync(file.path);
            const fileExtension = file.originalname.split('.').pop();
            const key = Math.random().toString(36).substring(2, 8);
            const filename = `${file.fieldname}-${key}.${fileExtension}`;

            return await s3
                .upload({
                    Bucket: 'skyhaus-test',
                    Key: filename, // Include extension
                    Body: bufferOg,
                    ContentType: file.mimetype,
                })
                .promise();
        }
    };
}
