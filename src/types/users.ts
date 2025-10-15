import { Request } from 'express'
import mongoose from 'mongoose'

export type TUserComment = {
	postId: mongoose.Types.ObjectId
	content: string
}

export type TUser = {
	_id: string
	name: string
	username: string
	email: string
	password: string
	bio?: string
	avatar?: string
	cover?: string
	location?: string
	followers: string[]
	following: string[]
	favs: string[]
	saved: string[]
	likes: mongoose.Types.ObjectId[]
	comments: TUserComment[]
	payOptions: string[]
}

export type TAuthRequest = Request & {
	user?: {
		username: string
		userId: string
		email: string
	}
}
