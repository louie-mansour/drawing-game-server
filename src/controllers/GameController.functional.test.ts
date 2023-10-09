import { describe, expect, test } from '@jest/globals'
import axios, { AxiosError, isAxiosError } from 'axios'
import { Authentication } from '../middleware/Authentication'
import { GameState } from '../models/Game'
import { Player } from '../models/Player'
import { PostgresRepo } from '../repos/PostgresRepo'

describe('GameController', () => {
  const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:3001',
  })
  const player = new Player({
    username: 'username',
  })
  const validAccessToken = Authentication.createGuestAccessToken(player)

  const postgresRepo = new PostgresRepo({
    host: 'localhost',
    user: 'postgres',
    password: 'example',
    database: 'drawing_game',
    port: 5432,
  })

  describe('create', () => {
    test('requires permission to create a game', async () => {
      let res: any
      try {
        await axiosClient.post('/game/create')
      } catch (e) {
        res = e
      }
      expect(res.response.status).toBe(401)
    })

    test('creates a new game', async () => {
      const res = await axiosClient.post('/game/create', undefined, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })
      expect(res.status === 200)
      const gameResponse = res.data.game
      expect(gameResponse.uuid).toBeDefined()
      expect(gameResponse.invite).toBeDefined()
      expect(gameResponse.players[0].uuid).toEqual(player.uuid)

      const game = await postgresRepo.getGame(gameResponse.uuid)
      expect(game.uuid).toBe(gameResponse.uuid)
      expect(game.invite).toBe(gameResponse.invite)
      expect(game.ownerUuid).toBe(player.uuid)
      expect(game.state).toBe(GameState.Lobby)
      expect(game.players.length).toBe(1)
      expect(game.players[0].uuid).toBe(player.uuid)
      expect(game.players[0].username).toBe(player.username)
    })
  })

  describe('join', () => {
    test('requires permission to join a game', async () => {
      let res: any
      try {
        await axiosClient.put('/game/join', {
          game: {
            invite: 'incorrectInvite',
          },
        })
      } catch (e) {
        res = e
      }
      expect(res.response.status === 401)
    })

    test('cannot join a game which has not been created', async () => {
      const incorrectInvite = {
        game: {
          invite: 'incorrectInvite',
        },
      }

      let error
      try {
        await axiosClient.put('/game/join', incorrectInvite, {
          headers: {
            Authorization: `bearer ${validAccessToken}`,
          },
        })
      } catch (e: unknown) {
        error = e
      }
      expect(isAxiosError(error)).toBe(true)
      const axiosError = error as AxiosError
      expect(axiosError.response!.status).toBe(400)
      const responseBody = axiosError.response!.data! as any
      expect(responseBody.message).toBeDefined()
    })

    test('joins a game', async () => {
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

      const res = await axiosClient.put('/game/join', invite, {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      })

      expect(res.status === 200)
      const joinResponse = res.data.game
      expect(joinResponse.uuid).toBeDefined()
      expect(joinResponse.invite).toBeDefined()
      expect(joinResponse.players.length).toEqual(2)
      expect(joinResponse.players[0].uuid).toEqual(gameOwner.uuid)
      expect(joinResponse.players[0].username).toEqual(gameOwner.username)
      expect(joinResponse.players[1].uuid).toEqual(player.uuid)
      expect(joinResponse.players[1].username).toEqual(player.username)

      expect(joinResponse.state).toBe(GameState.Lobby)

      const game = await postgresRepo.getGame(joinResponse.uuid)
      expect(game.uuid).toBe(joinResponse.uuid)
      expect(game.invite).toBe(joinResponse.invite)
      expect(game.ownerUuid).toBe(gameOwner.uuid)
      expect(game.players.length).toEqual(2)
      expect(game.players[0].uuid).toEqual(gameOwner.uuid)
      expect(game.players[0].username).toEqual(gameOwner.username)
      expect(game.players[1].uuid).toEqual(player.uuid)
      expect(game.players[1].username).toEqual(player.username)
      expect(game.state).toBe(GameState.Lobby)
    })
  })

  describe('playerReady', () => {
    test('requires permission to set player to ready', async () => {
      let res: any
      try {
        await axiosClient.put('/game/player-ready', {
          game: {
            invite: 'incorrectInvite',
          },
        })
      } catch (e) {
        res = e
      }
      expect(res.response.status === 401)
    })
  })

  test('sets the player to ready', async () => {
    const createGameRes = await axiosClient.post('/game/create', undefined, {
      headers: {
        Authorization: `bearer ${validAccessToken}`,
      },
    })

    expect(createGameRes.data.game.players.every((p: any) => !p.is_ready)).toBe(true)

    const res = await axiosClient.put(
      '/game/player-ready',
      {
        game: {
          invite: createGameRes.data.game.invite,
        },
      },
      {
        headers: {
          Authorization: `bearer ${validAccessToken}`,
        },
      }
    )

    expect(res.status === 200)
    const gameResponse = res.data.game
    expect(gameResponse.players.every((p: any) => p.is_ready)).toBe(true)

    const game = await postgresRepo.getGame(gameResponse.uuid)
    expect(game.players.every((p: Player) => p.isReady)).toBe(true)
  })
})
