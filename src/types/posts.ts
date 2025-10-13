import { ObjectId } from 'mongoose'

export type TAuthor = {
	_id: ObjectId
	name: string
	username: string
	avatar?: string
}

export type TMedia = {
	url: string
	key: string
	type: 'image' | 'video'
	size: number
	thumbnail?: string // For videos
	duration?: number // For videos
}

export type TComment = {
	author: ObjectId
	text: string
}

export type TPost = {
	author: TAuthor
	title: string
	content: string
	media: TMedia[]
	likes?: string[]
	comments?: TComment[]
}

export type TUploadResult = {
	url: string
	key: string
	size: number
	thumbnail?: string
	duration?: number
}
