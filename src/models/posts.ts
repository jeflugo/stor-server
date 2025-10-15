import mongoose from 'mongoose'
import { TComment, TPost } from '../types/posts'

const MediaSchema = new mongoose.Schema({
	url: { type: String, required: true },
	key: { type: String, required: true },
	type: { type: String, enum: ['image', 'video'], required: true },
	size: { type: Number, default: 0 },
	thumbnail: { type: String },
	duration: { type: Number },
})

const CommentSchema = new mongoose.Schema<TComment>(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: { type: String, required: true },
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const PostSchema = new mongoose.Schema<TPost>(
	{
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: { type: String, required: true },
		content: { type: String, required: true },
		media: { type: [MediaSchema], default: [] },
		likes: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User',
				},
			],
			default: [],
		},
		comments: {
			type: [CommentSchema],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const Post = mongoose.model('Post', PostSchema)

export default Post
