import { describe, expect, test } from '@jest/globals'
import { Authentication } from '../middleware/Authentication'

import axios from 'axios'
import { Player } from '../models/Player'

describe('PlayerController', () => {
  const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:3001',
  })
  describe('guestLogin', () => {
    test('if player has a valid auth token then use the existing token', async () => {
      const player = new Player({
        username: 'username',
      })

      const body = {
        player: {
          username: player.username,
        },
      }
      const validAccessToken = Authentication.createGuestAccessToken(player)

      const res = await axiosClient.put('/guest/login', body, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })
      expect(res.status).toBe(200)
      expect(res.data).toEqual({
        player: {
          uuid: player.uuid,
          username: player.username,
        },
        access_token: validAccessToken,
      })
    })

    test('if player has an invalid auth token then use a new token', async () => {
      const player = new Player({
        username: 'username',
      })

      const body = {
        player: {
          username: player.username,
        },
      }
      const invalidAccessToken = 'badToken'

      const res = await axiosClient.put('/guest/login', body, {
        headers: {
          Authorization: `bearer ${invalidAccessToken}`,
        },
      })
      expect(res.status).toBe(200)

      const responsePlayer = res.data.player
      expect(res.data.access_token).toBeDefined()
      expect(res.data.access_token).not.toBe(invalidAccessToken)
      expect(responsePlayer.uuid).toBeDefined()
      expect(responsePlayer.uuid).not.toBe(player.uuid)
      expect(responsePlayer.username).toBe(player.username)
    })

    test('if player has an no auth token then create a new token', async () => {
      const player = new Player({
        username: 'username',
      })

      const body = {
        player: {
          username: player.username,
        },
      }

      const res = await axiosClient.put('/guest/login', body)
      expect(res.status).toBe(200)

      const responsePlayer = res.data.player
      expect(res.data.access_token).toBeDefined()
      expect(responsePlayer.uuid).toBeDefined()
      expect(responsePlayer.uuid).not.toBe(player.uuid)
      expect(responsePlayer.username).toBe(player.username)
    })
  })
})
