// src/utils/upload.js

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import env from '../config/env.js'

// ─── S3 CLIENT SETUP ─────────────────────────────────────────────────────
// DigitalOcean Spaces endpoint use kar rahe hain
// AWS S3 use karna ho to endpoint hatao aur region 'ap-south-1' ya apna region dalo
const s3 = new S3Client({
  endpoint      : `https://${env.spaces.region}.digitaloceanspaces.com`, // DigitalOcean Spaces
  // endpoint   : `https://s3.amazonaws.com`                             // AWS S3
  region        : env.spaces.region,
  credentials   : {
    accessKeyId    : env.spaces.accessKey,
    secretAccessKey: env.spaces.secretKey,
  },
  forcePathStyle: false, // DigitalOcean ke liye false rakhna
})

// ── Upload file to Spaces/S3 ───────────────────────────────────────────────
const uploadFile = async ({ buffer, key, mimeType, isPublic = true }) => {
  const command = new PutObjectCommand({
    Bucket     : env.spaces.bucket,
    Key        : key,
    Body       : buffer,
    ContentType: mimeType,
    ACL        : isPublic ? 'public-read' : 'private',
  })

  await s3.send(command)

  // DigitalOcean Spaces public URL
  // AWS S3 URL format: https://{bucket}.s3.{region}.amazonaws.com/{key}
  const url = `https://${env.spaces.bucket}.${env.spaces.region}.digitaloceanspaces.com/${key}`

  return url
}

// ── Delete file from Spaces/S3 ─────────────────────────────────────────────
const deleteFile = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: env.spaces.bucket,
    Key   : key,
  })

  await s3.send(command)
}

export { uploadFile, deleteFile }