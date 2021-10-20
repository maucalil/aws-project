import S3Storage from "../utils/S3Storage";


export default class UploadImageService {
    async execute(file: Express.Multer.File): Promise<void> {
        const s3Storage = new S3Storage();
        await s3Storage.uploadFile(file.filename);
    }
}