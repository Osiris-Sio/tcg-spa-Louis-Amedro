<template>
  <NButton
    size="small"
    type="info"
    ghost
    style="width: auto; margin-bottom: 20px"
    @click="handleBack"
  >
    🠔 Retour
  </NButton>

  <NCard title="Modifier le deck">
    <NSpin :show="loading">
      <NLabel>Nom du deck</NLabel>
      <NInput v-model:value="deckName" placeholder="Mon super deck" />

      <NText
        >{{ selectedIds.length }} / {{ MAX_CARDS }} cartes sélectionnées</NText
      >

      <NAlert v-if="error" type="error"> {{ error }}</NAlert>

      <NButton
        type="success"
        :loading="loadingSubmit"
        icon-placement="left"
        :disabled="selectedIds.length !== MAX_CARDS || deckName === ''"
        @click="handleEdit"
      >
        Enregistrer les modifications
      </NButton>

      <CardGrid
        v-model="selectedIds"
        :card-ids="cards.map((c) => c.id)"
        :max="MAX_CARDS"
        size="sm"
      />
    </NSpin>
  </NCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/Card/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { useCardsStore } from '@/store/cards'

const router = useRouter()
const route = useRoute()
const api = useApi()
const cardsStore = useCardsStore()

const deckId = route.params.id as string
const cards = computed(() => cardsStore.cards)

const MAX_CARDS = 10
const loading = ref(true)
const loadingSubmit = ref(false)
const deckName = ref('')
const selectedIds = ref<number[]>([])
const error = ref('')

const handleBack = () => router.push(`/decks/${deckId}`)

const fetchDeckData = async () => {
  try {
    const deck = await api.getDeck(deckId)
    deckName.value = deck.name
    selectedIds.value = deck.cards.map((c) => c.cardId)
  } catch (e) {
    error.value =
      e instanceof Error
        ? e.message
        : 'Erreur lors du chargement des informations du deck.'
  }
  loading.value = false
}

const handleEdit = async () => {
  loadingSubmit.value = true
  try {
    await api.updateDeck(deckId, {
      name: deckName.value,
      cards: selectedIds.value,
    })
    router.push(`/decks/${deckId}`)
  } catch (e) {
    error.value =
      e instanceof Error ? e.message : 'Erreur lors de la mise à jour.'
  }
  loadingSubmit.value = false
}

onMounted(async () => {
  await cardsStore.fetchCards()
  await fetchDeckData()
})
</script>

<style scoped>
.n-card {
  justify-self: center;
}

.n-button {
  width: 100%;
}
.n-input {
  margin-bottom: 20px;
}

.n-text {
  text-align: center;
  display: block;
  margin-bottom: 20px;
}
</style>
