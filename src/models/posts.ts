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

const AuthorSchema = new mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		reuired: true,
	},
	username: {
		type: String,
		reuired: true,
	},
	avatar: {
		type: String,
	},
})

const CommentSchema = new mongoose.Schema<TComment>(
	{
		author: {
			type: AuthorSchema,
			required: true,
		},
		content: { type: String, required: true },
		likes: {
			type: [AuthorSchema],
			default: [],
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
)

const PostSchema = new mongoose.Schema<TPost>(
	{
		author: {
			type: AuthorSchema,
			required: true,
		},
		title: { type: String, required: true },
		content: { type: String, required: true },
		media: { type: [MediaSchema], default: [] },
		likes: {
			type: [AuthorSchema],
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
