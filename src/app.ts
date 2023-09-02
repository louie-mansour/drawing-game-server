import { Request, Response } from 'express'
import { AppFactory } from './AppFactory'
import express from 'express'
import bodyParser from 'body-parser'
import { FallbackErrorHandler } from './controllers/FallbackErrorHandler'
;(async () => {
  const app = express()
  const port = 3001
  app.use(bodyParser.json())

  const fallbackErrorHandler = new FallbackErrorHandler()
  const controllers = await AppFactory.buildApp()

  app.get('/health', (req: Request, res: Response) => {
    return res.status(200).send()
  })

  app.put('/drawing/submit', async (req: Request, res: Response) => {
    try {
      return await controllers.turnController.submitDrawingPart(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res)
    }
  })

  app.get('/drawing/previous', async (req: Request, res: Response) => {
    try {
      return await controllers.turnController.getPreviousDrawingPart(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res)
    }
  })

  app.listen(port, () => {
    console.log(`Drawing app listening on port ${port}`)
  })
})()
