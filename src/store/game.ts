import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router from '@/router'
import type { GameEndedPayload, GameState, Room } from '@/types'

import { useAuthStore } from './auth'

/**
 * Store gérant la connexion Socket.io et l'état du lobby / partie
 */
export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket | null>(null)
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const error = ref<string | null>(null)

  // État de la partie en cours
  const game = ref<GameState | null>(null)
  const winner = ref<string | null>(null)
  const myFinalScore = ref<number | null>(null)
  const opponentFinalScore = ref<number | null>(null)
  const message = ref<string>('')
  const role = ref<'hôte' | 'invité' | null>(null)

  // Détermine si c'est au joueur de jouer
  const isMyTurn = computed(() => {
    return game.value?.currentPlayerSocketId === socket.value?.id
  })

  // Connexion au serveur Socket.io avec authentification JWT
  const connect = (): void => {
    const auth = useAuthStore()
    // Si pas de token ou déjà connecté, on ne fait rien
    if (!auth.token || socket.value?.connected) return

    socket.value = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: auth.token },
    })

    socket.value.on('connect', () => {
      socket.value?.emit('getRooms')
    })

    // Mise à jour de la liste des rooms
    socket.value.on('roomsList', (list: Room[]) => (rooms.value = list))
    socket.value.on('roomsListUpdated', (list: Room[]) => (rooms.value = list))

    // Enregistrement de l'ID de la room créée
    socket.value.on('roomCreated', (room: Room) => {
      currentRoomId.value = room.id
      role.value = 'hôte'
    })

    // Déblocage de la partie (initialisation de l'état)
    socket.value.on('gameStarted', (initialState: GameState) => {
      game.value = initialState
      currentRoomId.value = initialState.roomId
      router.push('/game')
    })

    // Mise à jour de l'état du jeu
    socket.value.on('gameStateUpdated', (newState: GameState) => {
      game.value = newState
    })

    // Message en temps réel
    socket.value.on('yourTurn', (data: { message: string }) => {
      message.value = data.message
    })

    // Fin de partie
    socket.value.on('gameEnded', (payload: GameEndedPayload) => {
      winner.value = payload.winner
      if (game.value) {
        myFinalScore.value = payload.finalScores[game.value.you.username]
        opponentFinalScore.value =
          payload.finalScores[game.value.opponent.username]
      }
    })

    // Adversaire déconnecté
    socket.value.on('opponentDisconnected', () => {
      error.value = "L'adversaire s'est déconnecté."
    })

    // Gestion des erreurs
    socket.value.on('error', (data: { message: string }) => {
      error.value = data.message
    })
  }

  // Actions de jeu

  // Piocher des cartes
  const drawCards = (): void => {
    socket.value?.emit('drawCards')
    message.value = 'Vous piochez des cartes...'
  }

  // Jouer une carte
  const playCard = (cardIndex: number): void => {
    socket.value?.emit('playCard', { cardIndex })
  }

  // Attaquer
  const attack = (): void => {
    socket.value?.emit('attack')
    message.value = 'Vous attaquez !'
  }

  // Finir le tour
  const endTurn = (): void => {
    if (!currentRoomId.value) return
    socket.value?.emit('endTurn', { roomId: currentRoomId.value })
  }

  // Remise à zéro de l'état
  const resetGame = (): void => {
    game.value = null
    winner.value = null
    myFinalScore.value = null
    opponentFinalScore.value = null
    message.value = ''
    error.value = null
    role.value = null
  }

  // Création d'une room avec le deck sélectionné
  const createRoom = (deckId: number): void => {
    if (!socket.value) return
    socket.value.emit('createRoom', { deckId })
  }

  // Rejoindre une room avec le deck sélectionné
  const joinRoom = (roomId: string, deckId: number): void => {
    if (!socket.value) return
    role.value = 'invité'
    socket.value.emit('joinRoom', { roomId, deckId })
  }

  // Déconnexion
  const disconnect = (): void => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
    }
  }

  return {
    rooms,
    currentRoomId,
    error,
    game,
    winner,
    myFinalScore,
    opponentFinalScore,
    message,
    isMyTurn,
    role,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
  }
})
