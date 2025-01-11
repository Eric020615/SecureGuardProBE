import express, { Response } from 'express'
import { ValidateError } from 'tsoa'
import { RegisterRoutes } from './routes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerJson from './swagger.json'

const corsOptions = {
	origin: ['http://localhost:8081', 'http://localhost:8082', 'http://localhost:4000', 'http://10.167.56.15:4000'],
	optionsSuccessStatus: 200,
}

export const registerRoutes = (app: express.Express) => {
	app
		.use(cors(corsOptions))
		.use(express.urlencoded({ extended: true, limit: '50mb' }))
		.use(express.json({ limit: '50mb' }))
		.use(['/openapi', '/docs', '/swagger'], swaggerUi.serve, swaggerUi.setup(swaggerJson))
		.use((_req, res, next) => {
			res.header(
				'Access-Control-Allow-Headers',
				`Origin, X-Requested-With, Content-Type, Accept, Authorization`,
			)
			next()
		})

	RegisterRoutes(app)

	app.use(
		(
			err: any,
			req: express.Request,
			res: express.Response,
			next: express.NextFunction,
		): Response | void => {
			res.setHeader('Content-Type', 'application/json') // Force response to JSON
			if (err instanceof ValidateError) {
				console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
				return res.status(422).json({
					message: `Validation Failed, ${err?.fields}`,
					status: 500,
					data: null,
				})
			}
			if (err instanceof Error) {
				console.error(`Caught Error for ${req.path}:`, err)
				return res.status(500).json({
					message: 'Internal Server Error',
					status: 500,
					data: null,
				})
			}
			next()
		},
	)
}
