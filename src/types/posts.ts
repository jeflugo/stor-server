import { ObjectId } from 'mongoose'

export type TComment = {
	author: ObjectId
	text: string
}

export type TPost = {
	author: ObjectId
	title: string
	content: string
	media?: string[]
	likes?: string[]
	comments?: TComment[]
}
