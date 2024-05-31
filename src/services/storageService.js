import storage from "../../storage/index.js";
import fs from "fs";

const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

export const uploadFile = async (file) => {
  try {
    const bucketName = process.env.GCLOUD_STORAGE_BUCKET;
    const filePath = file.path;

    const customMetadata = {
      contentType: "image/jpeg",
      metadata: {
        type: "child-image",
      },
    };

    const optionsUploadObject = {
      destination: `images/${file.filename}`,
      metadata: customMetadata,
    };

    await storage.bucket(bucketName).upload(filePath, optionsUploadObject);

    const url = process.env.GCLOUD_STORAGE_OBJECT_URL + file.filename;

    await deleteFile(filePath);

    return url;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
