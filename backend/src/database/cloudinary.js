import {v2 as cloudinary} from "cloudinary"

import { config } from "dotenv"

config();

cloudinary.config({
    cloud_name:process.env.CLODINAR_CLOUD_NAME,
    api_key:process.env.CLODINAR_API_KEY,
    api_secret:process.env.CLODINAR_API_SECRET
});

export default cloudinary;
