import { Request } from 'express'

export type TActivity = {
	_id?: string
	user: string
	type: 'like' | 'comment' | 'follow' | 'post' | 'product' | 'review'
	createdAt: Date
	relatedId: string
	read: boolean
}

export type TUser = {
	_id?: string
	name: string
	lastname: string
	username: string
	email: string
	password: string
	location?: string
	bio?: string
	avatar?: string
	cover?: string
	followers?: string[]
	following?: string[]
	products?: string[]
	posts?: string[]
	favs?: string[]
	saved?: string[]
	payOptions?: string[]
	blocked?: string[]
	reviews?: string[]
	activity?: TActivity[]
}

export type TUserInput = {
	username: string
	email: string
	password: string
}

export type TUserLogin = {
	email: string
	password: string
}

export type TAuthRequest = Request & {
	user?: {
		userId: string
		email: string
	}
}
