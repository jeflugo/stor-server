import multer from 'multer'

// Configure multer for file uploads
const upload = multer({
	limits: {
		fileSize: Math.max(
			parseInt(process.env.MAX_IMAGE_SIZE || '10') * 1024 * 1024,
			parseInt(process.env.MAX_VIDEO_SIZE || '50') * 1024 * 1024
		),
	},
	fileFilter: (req: any, file: any, cb: any) => {
		// Allow both images and videos
		if (
			file.mimetype.startsWith('image/') ||
			file.mimetype.startsWith('video/')
		) {
			cb(null, true)
		} else {
			cb(new Error('Only image and video files are allowed') as any, false)
		}
	},
})

export { upload }
