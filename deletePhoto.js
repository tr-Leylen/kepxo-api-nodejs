import path from "path";
import { fileURLToPath } from "url"
import Photo from "./models/photo.model.js";
import fs from 'fs'

const uploadsFolder = process.env.SERVER_UPLOADS

export const deletePhoto = async (url) => {
    console.log(uploadsFolder)
    try {
        if (!url) return
        const photo = await Photo.findOne({ url })
        const fileName = photo?.fileName
        const filepath = path.join('/root/uploads', fileName);
        fs.unlink(filepath, async (err) => {
            if (err) {
                console.log(err)
                return;
            }
            await Photo.deleteOne({ url })
        });
    } catch (error) {
        console.log(error)
    }
}