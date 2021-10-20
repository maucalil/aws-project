import aws, { S3 } from "aws-sdk";
import path from "path";
import multerConfig from "../config/multer"
import mime from "mime";
import fs from "fs";

require('dotenv').config()

const bucketName: string = process.env.AWS_BUCKET_NAME!;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export default class S3Storage {
    private s3: S3;

    constructor() {
        this.s3 = new aws.S3({
            region,
            accessKeyId,
            secretAccessKey
        });
    }

    async uploadFile(filename: string): Promise<void> {
        const originalPath = path.resolve(multerConfig.directory, filename)
        const contentType =  mime.getType(originalPath);

        if(!contentType) {
            throw new Error('File not found!');
        }

        const fileContent = await fs.promises.readFile(originalPath);

        this.s3.upload({
            Bucket: bucketName,
            Body: fileContent,
            Key: `images/${filename}`,
            ContentType: contentType,
        }).promise().then(res => console.log(res));

        await fs.promises.unlink(originalPath);
    }
}