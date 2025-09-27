import mongoose from 'mongoose'
import { TPost } from '../types/posts'
import type { TComment } from '../types/posts'

const PostSchema = new mongoose.Schema<TPost>(
	{
		author: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, required: true },
		content: { type: String, required: true },
		media: { type: [String], default: [] },
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
