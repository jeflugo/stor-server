import { Request } from 'express'

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
	followers?: string[]
	following?: string[]
	favs?: string[]
	saved?: string[]
	payOptions?: string[]
}

export type TAuthRequest = Request & {
	user?: {
		userId: string
		email: string
	}
}
