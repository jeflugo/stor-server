import { connect } from 'mongoose'

async function connectDB() {
	const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017'
	const DB_NAME = 'stor'
	await connect(DB_URI, { dbName: DB_NAME })
}

export default connectDB
