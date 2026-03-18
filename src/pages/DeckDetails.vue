<template>
  <NButton size="small" type="info" ghost @click="handleBack">
    🠔 Retour
  </NButton>

  <NSpin :show="loading">
    <NCard v-if="deck" :title="deck.name">
      <NButton type="primary" size="small" @click="handleEdit">
        Modifier
      </NButton>

      <CardGrid
        :card-ids="deck.cards.map((c) => c.cardId)"
        :max="MAX_CARDS"
        size="sm"
      />
    </NCard>

    <NAlert v-else-if="error" type="error">
      {{ error }}
    </NAlert>
  </NSpin>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/Card/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { useCardsStore } from '@/store/cards'
import type { Deck } from '@/types'

const cardsStore = useCardsStore()
const route = useRoute()
const router = useRouter()
const api = useApi()

const MAX_CARDS = 10
const deckId = route.params.id as string
const deck = ref<Deck | null>(null)
const loading = ref(true)
const error = ref('')

const fetchDeck = async () => {
  loading.value = true
  try {
    deck.value = await api.getDeck(deckId)
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors du chargement du deck'
  }
  loading.value = false
}

const handleBack = () => router.push(ROUTES.HOME)
const handleEdit = () => router.push(`/decks/${deckId}/edit`)

onMounted(() => {
  fetchDeck()
  cardsStore.fetchCards()
})
</script>

<style scoped>
.n-card {
  margin-top: 20px;
}
</style>
