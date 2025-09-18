import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { router } from './routes'
import db from './config/mongo'

db().then(() => console.log('Connected to db'))

const app = express()
const port = process.env.PORT || 3000

app.use(morgan('tiny'))

app.use(
	cors({
		origin: process.env.CLIENT_URL,
	})
)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(router)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => {
	console.log(`Running on port: ${port}`)
})
