import { describe, expect, test } from '@jest/globals'
import axios from 'axios'
import { Authentication } from '../middleware/Authentication'
import { Player } from '../models/Player'

describe('TurnController', () => {
  const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:3001',
  })
  const player = new Player({
    username: 'username',
  })
  const validAccessToken = Authentication.createGuestAccessToken(player)
  describe('submitDrawingPart', () => {
    test('requires permission to submit a drawing part', async () => {
      const body = {
        drawing: {
          base_64_image: 'base64Image',
        },
      }

      let res: any
      try {
        await axiosClient.put('game/mockUuid/drawing/submit', body)
      } catch (e) {
        res = e
      }
      expect(res.response.status === 401)
    })

    test('saves a drawingPart to the database', async () => {
      const gameOwner = new Player({
        username: 'owner',
      })
      const gameOwnerAccessToken = Authentication.createGuestAccessToken(gameOwner)

      const createGameRes = await axiosClient.post('/game/create', undefined, {
        headers: {
          Authorization: `bearer ${gameOwnerAccessToken}`,
        },
      })
      const createGameResponse = createGameRes.data.game

      const invite = {
        game: {
          invite: createGameResponse.invite,
        },
      }

      const joinGameRes = await axiosClient.put('/game/join', invite, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })

      const joinGameResResponse = joinGameRes.data.game

      const body = {
        drawing_part: {
          base_64_image: 'base64Image',
          game_uuid: joinGameResResponse.uuid,
        },
      }

      const submitRes = await axiosClient.put(`/game/${joinGameResResponse.uuid}/drawing/submit`, body, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })
      expect(submitRes.status).toBe(200)
      expect(submitRes.data.drawing_part.base_64_image).toBe('base64Image')
      expect(submitRes.data.drawing_part.contributor_uuid).toBe(player.uuid)
      expect(submitRes.data.drawing_part.game_uuid).toBe(createGameResponse.uuid)
      expect(submitRes.data.drawing_part.uuid).toBeDefined()
    })
  })

  describe('getPreviousDrawingPart', () => {
    test('requires permission to get a drawing part', async () => {
      let res: any
      try {
        await axiosClient.get('/drawing/previous')
      } catch (e) {
        res = e
      }
      expect(res.response.status === 401)
    })

    test('gets the previous drawing part', async () => {
      const gameOwner = new Player({
        username: 'owner',
      })
      const gameOwnerAccessToken = Authentication.createGuestAccessToken(gameOwner)

      const createGameRes = await axiosClient.post('/game/create', undefined, {
        headers: {
          Authorization: `bearer ${gameOwnerAccessToken}`,
        },
      })
      const createGameResponse = createGameRes.data.game

      const invite = {
        game: {
          invite: createGameResponse.invite,
        },
      }

      const joinGameRes = await axiosClient.put('/game/join', invite, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })

      const joinGameResResponse = joinGameRes.data.game

      const ownerBody = {
        drawing_part: {
          base_64_image: 'base64ImageOwner',
          game_uuid: createGameResponse.uuid,
        },
      }

      await axiosClient.put(`/game/${createGameResponse.uuid}/drawing/submit`, ownerBody, {
        headers: {
          Authorization: `bearer ${gameOwnerAccessToken}`,
        },
      })

      const playerBody = {
        drawing_part: {
          base_64_image: 'base64ImagePlayer',
          game_uuid: joinGameResResponse.uuid,
        },
      }

      await axiosClient.put(`/game/${joinGameResResponse.uuid}/drawing/submit`, playerBody, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })

      const playerPrevDrawingRes = await axiosClient.get(`/game/${joinGameResResponse.uuid}/drawing/previous`, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })
      expect(playerPrevDrawingRes.status).toBe(200)
      expect(playerPrevDrawingRes.data.drawing_part.base_64_image).toBe('base64ImageOwner')
      expect(playerPrevDrawingRes.data.drawing_part.contributor_uuid).toBe(gameOwner.uuid)
      expect(playerPrevDrawingRes.data.drawing_part.game_uuid).toBe(createGameResponse.uuid)
      expect(playerPrevDrawingRes.data.drawing_part.uuid).toBeDefined()
    })
  })
})
