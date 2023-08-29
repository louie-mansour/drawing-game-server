import { Request, Response } from "express"
import { AppFactory } from "./AppFactory"

(async () => {
  const express = require('express')
  const app = express()
  const port = 3001

  const controllers = await AppFactory.buildApp()

  app.get('/', (req: Request, res: Response) => {
    console.log('hello')
      res.send(200)
  })

  app.put('/drawing/submit', (req: Request, res: Response) => {
      return controllers.turnController.submitDrawingPart(req, res)
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})()
