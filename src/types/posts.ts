export type TComment = {
	_id?: string
	user: string
	text: string
}

export type TPost = {
	_id?: string
	description: string
	images?: string[]
	videos?: string[]
	createdBy: string
	likes?: string[]
	comments?: TComment[]
}
