import { S3Client, HeadBucketCommand, PutObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import fs from "fs";
// require('dotenv').config();

const s3Client = new S3Client({
    region: 'us-west-2',
    });

const bucketExists = async (bucketName: string) => {
    try {
        await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
        return true;
    }
    catch (error:any) {
        if (error.name === "NotFound") {
            return false;
        }
        throw error;
    }
};

const prefixExists = (bucketName: string, prefix: string) => {
    return s3Client.send(new ListObjectsCommand({ Bucket: bucketName, Prefix: prefix, MaxKeys: 1 }))
        .then(() => true)
        .catch((error) => {
            if (error.name === "NotFound") {
                return false;
            }
            throw error;
        });
};

const uploadBuffer = async (bucketName: string, prefix:string, key: string, buffer: Buffer) => {
    const s3Key = `${prefix}/${key}`;
    const headers = {
        'Content-Type': 'image/jpeg',
        'Content-Length': buffer.length
    }
    
    const response = await axios.post(`http://localhost:6968/storage/upload/${prefix}/${key}`, buffer);
    console.log(response.data);
    // return await s3Client.send(new PutObjectCommand({ Bucket: bucketName, Key: `${prefix}/${key}`, Body: buffer }));
}
const uploadFile = async (bucketName: string, prefix: string, key: string, file: string) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            throw err;
        }
        return uploadBuffer(bucketName, prefix, key, data);
    });
}

const getChapterImages = async (bucketName: string, prefix: string) => {
    if (!await prefixExists(bucketName, prefix)) {
        return [];
    }
    const data = await s3Client.send(new ListObjectsCommand({ Bucket: bucketName, Prefix: prefix }));
    if (!data.Contents) {
        return [];
    }
    return data.Contents.map((object) => object.Key);
}

export { bucketExists, prefixExists, uploadFile, uploadBuffer, getChapterImages };