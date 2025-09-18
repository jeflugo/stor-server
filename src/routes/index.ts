import { Router } from 'express'
import { readdirSync } from 'fs'

const ROUTER_PATH = `${__dirname}`
const router = Router()

const cleanFileName = (fileName: string) => fileName.split('.').shift()

readdirSync(ROUTER_PATH).filter(fileName => {
	const cleanName = cleanFileName(fileName)
	if (cleanName !== 'index') {
		import(`./${cleanName}`).then(routerModule => {
			console.log(`Loading /${cleanName} route.`)
			router.use(`/${cleanName}`, routerModule.router)
		})
	}
})

export { router }
