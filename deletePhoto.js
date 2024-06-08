import path from "path";
import { fileURLToPath } from "url"
import Photo from "./models/photo.model.js";
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deletePhoto = async (url) => {
    if (!url) return
    const photo = await Photo.findOne({ url })
    const fileName = photo?.fileName
    const filepath = path.join(__dirname, process.env.UPLOADS_DIR, fileName);
    fs.unlink(filepath, async (err) => {
        if (err) {
            console.log(err)
            return;
        }
        await Photo.deleteOne({ url })
    });
}