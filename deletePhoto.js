import path from "path";
import { fileURLToPath } from "url"
import Photo from "./models/photo.model.js";
import fs from 'fs'

const uploadsFolder = process.env.SERVER_UPLOADS

export const deletePhoto = async (url) => {
    try {
        if (!url) return
        const photo = await Photo.findOne({ url })
        const fileName = photo?.fileName
        const filepath = path.join(uploadsFolder, fileName);
        console.log(fileName)
        console.log(filepath)
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