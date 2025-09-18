import User from '../models/users'
import { TUser } from '../types'

const getUsers = async () => {
	const newUsers = await User.find()
	if (newUsers.length === 0) return null
	const newUsersModified = newUsers.map(({ id, name }) => {
		return {
			id,
			name,
		}
	})
	return newUsersModified
}

// const resetBreads = async () => {
// 	const newBreads = await SaltyBread.find()
// 	if (newBreads.length === 0) return null

// 	const newBreadsModified = await Promise.all(
// 		newBreads.map(async bread => {
// 			const updates = { left: 0, make: 0 }
// 			const updatedBread = await SaltyBread.findByIdAndUpdate(
// 				bread.id,
// 				updates,
// 				{
// 					new: true,
// 				}
// 			)
// 			const { id, name, weight, left, make, position } = updatedBread!
// 			return {
// 				id,
// 				name,
// 				weight,
// 				left,
// 				make,
// 				position,
// 			}
// 		})
// 	)
// 	return newBreadsModified
// }

// const reorderBreads = async (newOrder: TBreadOrder[]) => {
// 	await Promise.all(
// 		newOrder.map(async ({ id, position }) => {
// 			await SaltyBread.findByIdAndUpdate(id, { $set: { position } })
// 		})
// 	)
// 	return 'Order Updated'
// }

const postUser = async (user: TUser) => {
	const newUser = await User.create(user)
	const { id, name, email, password } = newUser
	return {
		id,
		name,
		email,
		password,
	}
}

// const getBread = async (id: string) => await SaltyBread.findById(id)

// const updateBread = async (id: string, updates: Partial<TBread>) => {
// 	const updatedBread = await SaltyBread.findByIdAndUpdate(id, updates, {
// 		new: true,
// 	})
// 	const { _id, name, weight, left, make, position } = updatedBread!
// 	return {
// 		id: _id,
// 		name,
// 		weight,
// 		left,
// 		make,
// 		position,
// 	}
// }

// const deleteBread = async (id: string) => {
// 	const deletedBread = await SaltyBread.findByIdAndDelete(id)
// 	return { id: deletedBread?.id }
// }

export default {
	getUsers,
	postUser,
	// resetBreads,
	// reorderBreads,
	// getBread,
	// updateBread,
	// deleteBread,
}
