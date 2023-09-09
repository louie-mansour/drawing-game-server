import { describe, test, expect } from '@jest/globals'
import { DrawingPart } from './DrawingPart'
import { Game } from './Game'
import { Player } from './Player'

describe('Game', () => {
  describe('getDrawingOwnerOfContribution', () => {
    test('returns owner for first drawing', () => {
      const players = ['0', '1', '2', '3'].map((u) => {
        return new Player({
          username: u,
          uuid: u,
        })
      })
      const game = new Game({
        ownerUuid: 'ownerUuid',
        players: players,
        drawingParts: [],
      })
      players.forEach((p) => {
        expect(game.getDrawingOwnerOfContribution(p)).toEqual(p.uuid)
      })
    })

    test('returns next player after one drawing is complete', () => {
      const players = ['0', '1', '2', '3'].map((u) => {
        return new Player({
          username: u,
          uuid: u,
        })
      })

      const drawingParts = players.map(
        (p) =>
          new DrawingPart({
            base64Image: 'base64Image',
            contributorUuid: p.uuid,
            drawingOwnerUuid: p.uuid,
            gameUuid: 'gameUuid',
          })
      )
      const game = new Game({
        ownerUuid: 'ownerUuid',
        players: players,
        drawingParts: drawingParts,
      })

      expect(game.getDrawingOwnerOfContribution(players[0])).toEqual('1')
      expect(game.getDrawingOwnerOfContribution(players[1])).toEqual('2')
      expect(game.getDrawingOwnerOfContribution(players[2])).toEqual('3')
      expect(game.getDrawingOwnerOfContribution(players[3])).toEqual('0')
    })

    test('returns correct player after two drawings are complete', () => {
      const players = ['0', '1', '2', '3'].map((u) => {
        return new Player({
          username: u,
          uuid: u,
        })
      })

      const drawingParts = [
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
      ]
      const game = new Game({
        ownerUuid: 'ownerUuid',
        players: players,
        drawingParts: drawingParts,
      })

      expect(game.getDrawingOwnerOfContribution(players[0])).toEqual('2')
      expect(game.getDrawingOwnerOfContribution(players[1])).toEqual('3')
      expect(game.getDrawingOwnerOfContribution(players[2])).toEqual('0')
      expect(game.getDrawingOwnerOfContribution(players[3])).toEqual('1')
    })

    test('returns correct player after three drawings are complete', () => {
      const players = ['0', '1', '2', '3'].map((u) => {
        return new Player({
          username: u,
          uuid: u,
        })
      })

      const drawingParts = [
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
      ]
      const game = new Game({
        ownerUuid: 'ownerUuid',
        players: players,
        drawingParts: drawingParts,
      })

      expect(game.getDrawingOwnerOfContribution(players[0])).toEqual('3')
      expect(game.getDrawingOwnerOfContribution(players[1])).toEqual('0')
      expect(game.getDrawingOwnerOfContribution(players[2])).toEqual('1')
      expect(game.getDrawingOwnerOfContribution(players[3])).toEqual('2')
    })

    test('returns correct player after two or three drawings are complete', () => {
      const players = ['0', '1', '2', '3'].map((u) => {
        return new Player({
          username: u,
          uuid: u,
        })
      })

      const drawingParts = [
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '0',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '0',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '1',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '2',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '3',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '2',
          gameUuid: 'gameUuid',
        }),
        new DrawingPart({
          base64Image: 'base64Image',
          drawingOwnerUuid: '3',
          contributorUuid: '1',
          gameUuid: 'gameUuid',
        }),
      ]
      const game = new Game({
        ownerUuid: 'ownerUuid',
        players: players,
        drawingParts: drawingParts,
      })

      expect(game.getDrawingOwnerOfContribution(players[0])).toEqual('2')
      expect(() => game.getDrawingOwnerOfContribution(players[1])).toThrow()
      expect(game.getDrawingOwnerOfContribution(players[2])).toEqual('0')
      expect(() => game.getDrawingOwnerOfContribution(players[3])).toThrow()
    })
  })
})
