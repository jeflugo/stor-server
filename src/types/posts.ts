import mongoose from 'mongoose'

export type TMedia = {
	url: string
	key: string
	type: 'image' | 'video'
	size: number
	thumbnail?: string // For videos
	duration?: number // For videos
}

export type TComment = {
	author: mongoose.Types.ObjectId
	content: string
}

export type TPost = {
	author: mongoose.Types.ObjectId
	title: string
	content: string
	media: TMedia[]
	likes: mongoose.Types.ObjectId[]
	comments: TComment[]
}

export type TUploadResult = {
	url: string
	key: string
	size: number
	thumbnail?: string
	duration?: number
}
