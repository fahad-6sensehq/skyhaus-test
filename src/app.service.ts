import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from '@notionhq/client';
import { Model } from 'mongoose';
import { appConfig } from './common/config';
import { Video } from './common/video.schema';

// const token = appConfig.token;
const notion = new Client({ auth: appConfig.notionToken });

@Injectable()
export class AppService {
    constructor(
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>,
    ) {}

    // async uploadVideo(file: Express.Multer.File) {
    //     const s3Response = await AwsServices.S3.uploadFile(file);

    //     if (s3Response == -1) {
    //         return {
    //             error: 'FILE TYPE NOT ALLOWED',
    //         };
    //     }

    //     const body = {
    //         name: file.fieldname,
    //         key: s3Response.Key,
    //         status: 'active',
    //         link: s3Response.Location,
    //     };

    //     return await this.videoModel.create(body);
    // }

    // async getAllVideos() {
    //     return await this.videoModel.find();
    // }

    // async getVideo(id: string) {
    //     const oid = new Types.ObjectId(id);
    //     return await this.videoModel.findById(oid);
    // }

    // async me() {
    //     const resp = await fetch(`https://api.frame.io/v2/me`, {
    //         method: 'GET',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     const data = await resp.text();
    //     console.log(data);

    //     return data;
    // }

    // async getAnAccount(id: string) {
    //     const resp = await fetch(`https://api.frame.io/v2/accounts`, {
    //         method: 'GET',
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });

    //     const data = await resp.text();
    //     console.log(data);

    //     return data;
    // }

    // async createTeam() {
    //     const accountId = '7f885221-28a9-4cb5-942d-6e24f95b854b';
    //     const resp = await fetch(
    //         `https://api.frame.io/v2/accounts/${accountId}/teams`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization:
    //                     'Bearer fio-u-iz60rolbre_ybc4t64_FsaLQ3m6vWNoCDp2v3uFEbh4A3P3VKi03vL1ON4t0ArqZ',
    //             },
    //             body: JSON.stringify({
    //                 access: 'public',
    //                 account_id: '7f885221-28a9-4cb5-942d-6e24f95b854b',
    //             }),
    //         },
    //     );

    //     console.log(accountId);

    //     const data = await resp.json();
    //     console.log(data);

    //     return data;
    // }

    // async createAsset() {
    //     const assetId = '1c24f2ac-d711-453a-9bb9-60372bf958f5';
    //     const resp = await fetch(
    //         `https://api.frame.io/v2/assets/${assetId}/children`,
    //         {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 type: 'file',
    //                 extension: '.mp4',
    //                 filetype: 'video/mp4',
    //                 is_realtime_upload: false,
    //             }),
    //         },
    //     );

    //     const data = await resp.json();
    //     console.log(data);

    //     return data;
    // }

    async notion(id) {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${id}/query`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${appConfig.notionToken}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sorts: [
                        { timestamp: 'created_time', direction: 'descending' },
                    ],
                }),
            },
        );

        const data = await response.json();
        const tasks = data.results;

        // Step 1: Create a map of all tasks by ID
        // const taskMap = new Map();
        // tasks.forEach((task) => {
        //     taskMap.set(task.id, {
        //         id: task.id,
        //         name:
        //             task.properties['Name'].title[0]?.plain_text || 'Untitled',
        //         parentId:
        //             task.properties['Parent item'].relation[0]?.id || null,
        //         done: task.properties['Done']?.checkbox || false,
        //         otherInfo: {
        //             date: task.properties['Date']?.date?.start || null,
        //             createdTime: task.created_time,
        //             lastEditedTime: task.last_edited_time,
        //             url: task.url,
        //         },
        //         children: [],
        //     });
        // });

        // // Step 2: Build parent-child relationships and maintain creation order
        // let rootTasks = [];
        // taskMap.forEach((task) => {
        //     if (task.parentId && taskMap.has(task.parentId)) {
        //         taskMap.get(task.parentId).children.push(task);
        //     } else {
        //         rootTasks.push(task);
        //     }
        // });

        // // Step 3: Order the children based on their creation order (Notion-like order)
        // function buildHierarchy(tasks) {
        //     return tasks.map((task) => {
        //         return {
        //             name: task.name,
        //             done: task.done,
        //             otherInfo: task.otherInfo,
        //             children: buildHierarchy(task.children),
        //         };
        //     });
        // }

        // return buildHierarchy(rootTasks);

        return tasks;
    }

    async getPageDetails(id: string) {
        const response = await fetch(
            `https://api.notion.com/v1/blocks/${id}/children`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${appConfig.notionToken}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
            },
        );

        return response.json();
    }

    async updatePageCheckbox(pageId: string, checked: boolean) {
        const response = await fetch(
            `https://api.notion.com/v1/pages/${pageId}`,
            {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${appConfig.notionToken}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    properties: {
                        Done: {
                            checkbox: checked,
                        },
                    },
                }),
            },
        );

        return response.json();
    }

    async notionSearch() {
        const response = await fetch('https://api.notion.com/v1/search', {
            method: 'POST', // Notion's search API requires a POST request
            headers: {
                Authorization: `Bearer ${appConfig.notionToken}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
                query: '',
                filter: {
                    value: 'database',
                    property: 'object',
                },
            }),
        });

        const data = await response.json();

        if (data.results) {
            console.log('Databases:', data.results);
        } else {
            console.log('No databases found.');
        }

        return data.results;
    }

    async database(name: string) {
        const response = await notion.databases.create({
            parent: {
                type: 'page_id',
                page_id: '18b3abf66f7a80df8f0eeb0490681b07',
            },
            icon: {
                type: 'emoji',
                emoji: '📝',
            },
            cover: {
                type: 'external',
                external: {
                    url: 'https://website.domain/images/image.png',
                },
            },
            title: [
                {
                    type: 'text',
                    text: {
                        content: `${name}`,
                        link: null,
                    },
                },
            ],
            properties: {
                Name: {
                    title: {},
                },
                Stage: {
                    select: {
                        options: [
                            {
                                name: 'Planning',
                                color: 'yellow',
                            },
                            {
                                name: 'Pre production',
                                color: 'blue',
                            },
                            {
                                name: 'Production',
                                color: 'gray',
                            },
                            {
                                name: 'Post production',
                                color: 'green',
                            },
                        ],
                    },
                },
                Status: {
                    select: {
                        options: [
                            {
                                name: 'To do',
                                color: 'blue',
                            },
                            {
                                name: 'In progress',
                                color: 'yellow',
                            },
                            {
                                name: 'Stuck',
                                color: 'red',
                            },
                            {
                                name: 'In review',
                                color: 'green',
                            },
                            {
                                name: 'Done',
                                color: 'green',
                            },
                        ],
                    },
                },
            },
        });

        // Print the new database response
        console.log(response);
        return response;
    }

    async getDatabase(id: string) {
        const response = await notion.databases.retrieve({
            database_id: id,
        });

        console.log(response);

        return response;
    }

    async editDatabase(id: string) {
        const response = await fetch(
            `https://api.notion.com/v1/databases/${id}`,
            {
                method: 'PATCH',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${appConfig.notionToken}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28',
                },
                body: JSON.stringify({
                    properties: {
                        Priority1: {
                            select: {
                                options: [
                                    { name: 'High', color: 'red' },
                                    { name: 'Medium', color: 'yellow' },
                                    { name: 'Low', color: 'green' },
                                ],
                            },
                        },
                    },
                }),
            },
        );

        // ✅ Parse JSON Response
        const data = await response.json();

        // ✅ Log any errors in response
        if (!response.ok) {
            console.error('Error updating database:', data);
        }

        return data;
    }
}
