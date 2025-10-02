import mongoose from 'mongoose'
import { TPost } from '../types/posts'
import type { TComment } from '../types/posts'

const MediaSchema = new mongoose.Schema({
	url: { type: String, required: true },
	key: { type: String, required: true },
	type: { type: String, enum: ['image', 'video'], required: true },
	size: { type: Number, default: 0 },
	thumbnail: { type: String },
	duration: { type: Number },
})

const PostSchema = new mongoose.Schema<TPost>(
	{
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		media: { type: [MediaSchema], default: [] },
		likes: { type: [String], default: [] },
		comments: {
			type: [
				{
					author: {
						type: mongoose.Types.ObjectId,
						ref: 'User',
						required: true,
					},
					text: { type: String, required: true },
				},
			],
			default: [] as TComment[],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const Post = mongoose.model('posts', PostSchema)

export default Post
