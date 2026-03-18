import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

// Store pour gérer les cartes
export const useCardsStore = defineStore('cards', () => {
  const cards = ref<Card[]>([])
  const loading = ref(false)
  const api = useApi()

  // Fonction pour récupérer les cartes
  const fetchCards = async () => {
    if (cards.value.length > 0 || loading.value) return
    loading.value = true
    try {
      cards.value = await api.getCards()
    } catch {
      // Erreur ignorée
    }
    loading.value = false
  }

  // Fonction pour récupérer une carte par son ID
  const getCardById = (id: number) => {
    return cards.value.find((c) => c.id === id)
  }

  return { cards, loading, fetchCards, getCardById }
})
