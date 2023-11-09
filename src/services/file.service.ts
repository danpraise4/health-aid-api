import { v2 as cloudinary } from 'cloudinary';
import config from '../../config/apiGatewayConfig';
import log from '../logging/logger';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
});

export const uploadBase64File = async (
  base64File: string,
  folder = 'uploads',
  public_id: string,
) => {
  try {
    const response = await cloudinary.uploader.upload(base64File, {
      public_id,
      folder,
      resource_type: 'auto',
    });
    return response;
  } catch (err: any) {
    log.error(err);
    throw new Error(err.message);
  }
};

export const deleteFile = async (publicId: string) => {
  try {
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image',
      invalidate: true,
    });
    return response;
  } catch (err: any) {
    log.error(err);
    throw new Error(err.message);
  }
};

export const uploadVideo = async (
  video: string,
  folder = 'uploads',
  public_id: string,
) => {
  try {
    const response = await cloudinary.uploader.upload(video, {
      folder,
      public_id,
      resource_type: 'auto',
    });

    return response;
  } catch (err: any) {
    log.error(err);
    throw new Error(err.message);
  }
};

// export async function generateThumbnail(
//   videoPath: string,
//   // outputPath: string,
// ): Promise<void> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .on('error', (err) => {
//         reject(err);
//       })
//       .on('end', () => {
//         resolve();
//       })
//       .screenshots({
//         timestamps: ['50%'],
//         filename: 'thumbnail.png',
//         // folder: outputPath,
//         size: '320x240',
//       });
//   });
// }

// export async function generateThumbnail(
//   videoPath: string,
//   // time: number,
// ): Promise<Buffer> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .seekInput(50)
//       .frames(1)
//       .size('640x?')
//       .outputOptions('-vcodec', 'mjpeg')
//       .outputOptions('-f', 'image2pipe')
//       .output('-')
//       .on('error', (err) => {
//         reject(err.message);
//       })
//       .on('end', () => {
//         reject('No data received from ffmpeg');
//       })
//       .pipe()
//       .on('data', (data: Buffer) => {
//         resolve(data);
//       });
//   });
// }

// export async function generateThumbnail(
//   videoPath: string,
//   timestamp: string,
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const chunks: any[] = [];
//     Ffmpeg()
//       .input(videoPath)
//       .seekInput(timestamp)
//       .frames(1)
//       .output('pipe:')
//       .format('png')
//       .on('error', (err) => reject(err))
//       .on('end', () => resolve(Buffer.concat(chunks).toString('base64')))
//       .on('data', (chunk) => chunks.push(chunk))
//       .run();
//   });
// }
