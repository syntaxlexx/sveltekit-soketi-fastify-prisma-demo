import { returnRespError } from '$lib/server/helpers';
import { z } from 'zod'
import { createId } from '@paralleldrive/cuid2'

import { S3Client, PutObjectCommand, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const BUCKET = 'images'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2Mb
const ACCEPTED_FILE_TYPES = ['jpg', 'png', 'webp', 'bmp']
const S3_END_POINT = "http://localhost:4569"

const config = {
    forcePathStyle: true,
    credentials: {
        accessKeyId: 'S3RVER',
        secretAccessKey: 'S3RVER',
    },
    region: 'us-east-1',
    endpoint: S3_END_POINT,

}

const s3 = new S3Client(config)

const getImageKeysByUser = async (userId: string) => {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: userId
    })

    const { Contents = [] } = await s3.send(command);

    return Contents.map(image => image.Key)
}

const getUserPresignedUrls = async (userId: string) => {
    try {
        const imageKeys = await getImageKeysByUser(userId);

        const presignedUrls = await Promise.all(imageKeys.map(async (key) => {
            const command = new GetObjectCommand({
                Bucket: BUCKET,
                Key: key,
            })

            return {
                url: await getSignedUrl(s3, command, { expiresIn: 900 }),
                filekey: key,
            }
        }))

        return { presignedUrls }

    } catch (error) {
        console.log("error", error);
        return { error }
    }
}

export async function load() {
    const userId = 1;

    const { error, presignedUrls } = await getUserPresignedUrls(userId.toString())

    return {
        images: error ? [] : presignedUrls
    };
};

export const actions = {
    upload: async ({ request }) => {
        const data = Object.fromEntries(await request.formData())

        const validated = z.object({
            image: z.custom<File>()
                .refine(file => !!file, { message: "The image field is required" })
                .refine((file) => file?.size <= MAX_FILE_SIZE, { message: `File size should be less than ${MAX_FILE_SIZE / 1024 / 1024}mb.` })
                .refine(file => {
                    if (!file) return false;
                    const ft = file?.type.split('/')
                    return ACCEPTED_FILE_TYPES.includes(ft.length > 1 ? ft[1] : ft[0])
                }, { message: `Allowed filetypes: ${ACCEPTED_FILE_TYPES.join(', .')}` })
        }).safeParse(data)

        if (!validated.success) {
            return returnRespError(validated.error);
        }

        const userId = 1;
        let fileKey = `${userId}/${createId()}`

        switch (validated.data.image.type) {
            case 'image/png':
                fileKey += '.png';
                break;
            case 'image/jpeg':
            case 'image/jpg':
                fileKey += '.jpg';
                break;
            case 'image/bmp':
                fileKey += '.bmp';
                break;
            case 'image/webp':
                fileKey += '.webp';
                break;
            default: break;
        }

        const arrayBuffer = await validated.data.image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const command = new PutObjectCommand({
            Bucket: BUCKET,
            Key: fileKey,
            Body: buffer,
            ContentType: validated.data.image.type,
        })

        try {
            await s3.send(command)
        } catch (error) {
            console.log("error", error);
            return returnRespError(error?.message);
        }

        return {
            success: true,
            message: 'File uploaded',
            fileKey,
        }
    },

    deleteFile: async ({ request }) => {
        const data = Object.fromEntries(await request.formData())

        const validated = z.object({
            filename: z.string()
        }).safeParse(data)

        if (!validated.success) {
            return returnRespError(validated.error);
        }

        const command = new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: validated.data.filename,
        })

        try {
            await s3.send(command)
        } catch (error) {
            console.log("error", error);
            return returnRespError(error?.message);
        }

        return {
            success: true,
            message: 'File deleted',
        }

    },
}
