import { Request, Response } from 'express'
import { AppFactory } from './AppFactory'
import express from 'express'
import bodyParser from 'body-parser'

;(async () => {
  const app = express()
  const port = 3001
  app.use(bodyParser.json())


  const controllers = await AppFactory.buildApp()

  app.get('/health', (req: Request, res: Response) => {
    return res.send(200)
  })

  app.put('/drawing/submit', async (req: Request, res: Response) => {
    await controllers.turnController.submitDrawingPart(req, res)
    return res.send(200)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})()
