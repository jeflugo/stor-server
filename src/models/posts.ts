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
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'users',
			required: true,
		},
		title: { type: String, required: true },
		content: { type: String, required: true },
		media: { type: [MediaSchema], default: [] },
		likes: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'users',
				},
			],
			default: [],
		},
		comments: {
			type: [
				{
					author: {
						type: mongoose.Types.ObjectId,
						ref: 'users',
						required: true,
					},
					content: { type: String, required: true },
				},
			],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const Post = mongoose.model('posts', PostSchema)

export default Post
