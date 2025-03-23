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
        const filepath = path.join(uploadsFolder.toString(), fileName);
        console.log(uploadsFolder, 'log')
        console.log(filepath, 'log')
        fs.unlink(filepath.toString(), async (err) => {
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