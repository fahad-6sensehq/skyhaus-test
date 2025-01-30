import * as dotenv from 'dotenv';
dotenv.config();

export interface IConfig {
    mongodbURL: string;
    accessKeyId: string;
    secretAccessKey: string;
    awsRegion: string;
    dbName: string;
    dbQuery: string;
    token: string;
    notionToken: string;
}

const getAppConfig = (): IConfig => {
    const mongodbURL = process.env.MONGODB_URL;
    const accessKeyId = process.env.ACCESS_KEY_ID;
    const secretAccessKey = process.env.SECRET_ACCESS_KEY;
    const awsRegion = process.env.AWS_REGION;
    const dbName = process.env.dbName;
    const dbQuery = process.env.dbQuery;
    const token = process.env.FRAMER_TOKEN
    const notionToken = process.env.NOTION_TOKEN;

    if (!mongodbURL) console.log('mongodbURL must be specified');
    if (!accessKeyId) console.log('accessKeyId must be specified');
    if (!secretAccessKey) console.log('secretAccessKey must be specified');
    if (!awsRegion) console.log('awsRegion must be specified');

    return {
        mongodbURL,
        accessKeyId,
        secretAccessKey,
        awsRegion,
        dbName,
        dbQuery,
        token,
        notionToken
    };
};
export const appConfig = getAppConfig();
