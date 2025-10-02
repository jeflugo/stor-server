import { generateVideoThumbnail, getVideoDuration } from './videoProcessor'
import { TUploadResult } from '../types/posts.js'

import AWS from 'aws-sdk'

const s3 = new AWS.S3({
	endpoint: process.env.B2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.B2_APPLICATION_KEY_ID as string,
		secretAccessKey: process.env.B2_APPLICATION_KEY as string,
	},
	region: 'us-east-005',
	s3ForcePathStyle: false,
})

export class B2Service {
	static async uploadFile(
		fileBuffer: Buffer,
		fileName: string,
		mimetype: string,
		isVideo: boolean = false
	): Promise<TUploadResult | any> {
		try {
			let thumbnail: string | undefined
			let duration: number | undefined

			// Process video if it's a video file
			if (isVideo) {
				try {
					// Generate thumbnail from video
					const thumbnailBuffer = await generateVideoThumbnail(fileBuffer)
					if (thumbnailBuffer) {
						const thumbnailFileName = `thumbnails/${fileName.split('.')[0]}.jpg`
						const thumbnailResult = await this.uploadThumbnail(
							thumbnailBuffer,
							thumbnailFileName
						)
						thumbnail = thumbnailResult.url
					}

					// Get video duration
					duration = await getVideoDuration(fileBuffer)
				} catch (error) {
					console.warn(
						'Video processing failed, continuing without thumbnail:',
						error
					)
				}
			}

			const uploadParams: AWS.S3.PutObjectRequest = {
				Bucket: process.env.B2_BUCKET_NAME!,
				Key: fileName,
				Body: fileBuffer,
				ContentType: mimetype,
			}

			const result = await s3.upload(uploadParams).promise()

			return {
				url: result.Location,
				key: result.Key,
				size: fileBuffer.length,
				thumbnail,
				duration,
			}
		} catch (error) {
			console.error('Error uploading to B2:', error)
			throw new Error('Failed to upload file')
		}
	}

	static async deleteFile(fileKey: string): Promise<boolean> {
		const deleteParams: AWS.S3.DeleteObjectRequest = {
			Bucket: process.env.B2_BUCKET_NAME!,
			Key: fileKey,
		}

		try {
			await s3.deleteObject(deleteParams).promise()
			return true
		} catch (error) {
			console.error('Error deleting from B2:', error)
			throw new Error('Failed to delete file')
		}
	}

	private static async uploadThumbnail(
		thumbnailBuffer: Buffer,
		fileName: string
	): Promise<TUploadResult | any> {
		const uploadParams: AWS.S3.PutObjectRequest = {
			Bucket: process.env.B2_BUCKET_NAME!,
			Key: fileName,
			Body: thumbnailBuffer,
			ContentType: 'image/jpeg',
		}

		const result = await s3.upload(uploadParams).promise()

		return {
			url: result.Location,
			key: result.Key,
			size: thumbnailBuffer.length,
		}
	}
}
