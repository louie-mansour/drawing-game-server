import { Request, Response } from 'express'
import { AppFactory } from './AppFactory'
import express from 'express'
import bodyParser from 'body-parser'
import { FallbackErrorHandler } from './errors/FallbackErrorHandler'
import { AuthMiddleware } from './middleware/AuthMiddleware'
;(async () => {
  const app = express()
  const port = 3001
  app.use(bodyParser.json())

  const fallbackErrorHandler = new FallbackErrorHandler()
  const controllers = await AppFactory.buildApp()

  app.get('/health', (req: Request, res: Response) => {
    return res.status(200).send()
  })

  app.put('/guest/login', (req: Request, res: Response) => {
    try {
      return controllers.playerController.guestLogin(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.get('/game/:inviteId', async (req: Request, res: Response) => {
    try {
      return await controllers.gameController.get(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.post('/game/create', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
    try {
      return await controllers.gameController.create(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.put('/game/join', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
    try {
      return await controllers.gameController.join(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.put('/game/:game_uuid/drawing/submit', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
    try {
      return await controllers.turnController.submitDrawingPart(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.get('/game/:game_uuid/drawing/previous', AuthMiddleware.authenticate, async (req: Request, res: Response) => {
    try {
      return await controllers.turnController.getPreviousDrawingPart(req, res)
    } catch (e: unknown) {
      fallbackErrorHandler.handle(res, e)
    }
  })

  app.listen(port, () => {
    console.log(`Drawing app listening on port ${port}`)
  })
})()
