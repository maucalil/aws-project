import { response, Router } from "express";
import multer from "multer";

import multerConfig from '../config/multer';
import UploadImageService from "../services/UploadImageService";

const routes = Router();
const upload = multer(multerConfig)

routes.post('/upload', upload.single('image') ,async (req, res) => {
    const uploadImageService = new UploadImageService();
    const { file } = req;
    await uploadImageService.execute(file!);
    return res.send();
})

export default routes;