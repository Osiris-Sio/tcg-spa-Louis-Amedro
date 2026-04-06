import type { Card } from './card'

export interface GameCard extends Card {
  currentHP: number
}

export interface PlayerGameState {
  username: string
  hand: Card[]
  activeCard: GameCard | null
  score: number
  deckSize: number
}

export interface OpponentGameState {
  username: string
  handSize: number
  activeCard: GameCard | null
  score: number
  deckSize: number
}

export interface GameState {
  roomId: string
  currentPlayerSocketId: string
  you: PlayerGameState
  opponent: OpponentGameState
}

export interface GameEndedPayload {
  winner: string
  finalScores: Record<string, number>
}

export interface Room {
  id: string
  host: {
    userId: number
    username: string
    socketId: string
    deckId: number
  }
  opponent?: {
    userId: number
    username: string
    socketId: string
    deckId: number
  }
  status: 'waiting' | 'playing'
}
