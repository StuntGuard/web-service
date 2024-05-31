import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT_ID,
});

export default storage;
