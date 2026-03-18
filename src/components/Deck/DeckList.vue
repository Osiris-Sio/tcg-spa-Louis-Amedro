<template>
  <div class="deck-list">
    <div class="header">
      <h2>Mes Decks</h2>
      <NButton type="primary" @click="handleCreate"> + Nouveau deck </NButton>
    </div>

    <NSpin :show="loading">
      <div v-if="decks.length > 0">
        <NCard v-for="deck in decks" :key="deck.id" :title="deck.name">
          <CardGrid
            :card-ids="deck.cards.map((card) => card.cardId)"
            size="sm"
          />

          <NSpace>
            <NButton
              size="small"
              type="info"
              ghost
              @click="handleDetail(deck.id)"
            >
              Détails
            </NButton>
            <NButton size="small" ghost @click="handleEdit(deck.id)">
              Modifier
            </NButton>
            <NPopconfirm
              negative-text="Annuler"
              positive-text="Confirmer"
              @positive-click="handleDelete(deck.id)"
            >
              <template #trigger>
                <NButton size="small" type="error"> Supprimer </NButton>
              </template>
              Êtes-vous sûr de vouloir supprimer ce deck ?
            </NPopconfirm>
          </NSpace>
        </NCard>
      </div>

      <NAlert v-else-if="error" type="error"> {{ error }}</NAlert>

      <NEmpty v-else description="Vous n'avez pas encore de deck" />
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/Card/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { useCardsStore } from '@/store/cards'
import type { Deck } from '@/types'

const api = useApi()
const cardsStore = useCardsStore()
const router = useRouter()

const error = ref('')

const decks = ref<Deck[]>([])
const loading = ref(false)

// Chargement des decks au chargement de la page
const fetchDecks = async () => {
  loading.value = true
  try {
    const decksData = await api.getMyDecks()
    await cardsStore.fetchCards() // Récupération des cartes par le store
    decks.value = decksData
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors du chargement des decks.'
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await api.deleteDeck(id)
    await fetchDecks()
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors de la suppression du deck.'
  }
}

const handleCreate = () => router.push(ROUTES.CREATE_DECK)
const handleDetail = (id: number) => router.push(`/decks/${id}`)
const handleEdit = (id: number) => router.push(`/decks/${id}/edit`)

onMounted(fetchDecks)
</script>

<style scoped>
.deck-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.n-space {
  justify-self: end;
}
</style>
