import mongoose from 'mongoose'

export type TMedia = {
	url: string
	key: string
	type: 'image' | 'video'
	size: number
	thumbnail?: string // For videos
	duration?: number // For videos
}

export type TAuthor = {
	_id: mongoose.Types.ObjectId
	username: string
	avatar?: string
}

export type TComment = {
	_id?: mongoose.Types.ObjectId
	author: TAuthor
	content: string
	likes?: TAuthor[]
}

export type TPost = {
	author: TAuthor
	title: string
	content: string
	media: TMedia[]
	likes: TAuthor[]
	comments: TComment[]
}

export type TUploadResult = {
	url: string
	key: string
	size: number
	thumbnail?: string
	duration?: number
}
