<template>
  <NButton
    size="small"
    type="info"
    ghost
    style="width: auto"
    @click="handleBack()"
  >
    🠔 Retour
  </NButton>

  <NCard title="Créer un deck">
    <NLabel>Nom du deck</NLabel>
    <NInput v-model:value="deckName" placeholder="Mon super deck" />

    <NText
      >{{ selectedIds.length }} / {{ MAX_CARDS }} cartes sélectionnées</NText
    >

    <NAlert v-if="error" type="error"> {{ error }}</NAlert>

    <NButton
      type="success"
      :loading="loading"
      icon-placement="left"
      :disabled="selectedIds.length !== MAX_CARDS || deckName === ''"
      @click="handleCreate"
    >
      Créer le deck
    </NButton>

    <CardGrid
      v-model="selectedIds"
      :card-ids="cards.map((c) => c.id)"
      :max="MAX_CARDS"
      size="sm"
    />
  </NCard>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import CardGrid from '@/components/Card/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { useCardsStore } from '@/store/cards'

const router = useRouter()
const api = useApi()

const MAX_CARDS = 10
const loading = ref(false)

const cardsStore = useCardsStore()
const cards = computed(() => cardsStore.cards)

const selectedIds = ref<number[]>([])
const deckName = ref('')
const error = ref('')

const handleBack = () => router.push(ROUTES.HOME)

const handleCreate = async () => {
  loading.value = true
  try {
    await api.createDeck({ name: deckName.value, cards: selectedIds.value })
    router.push(ROUTES.HOME)
  } catch (e) {
    error.value = // S'il y a une erreur, affiche un message d'erreur
      e instanceof Error
        ? e.message
        : 'Erreur lors de la création du deck. Veuillez réessayer ultérieurement.'
  }
  loading.value = false
}

onMounted(async () => {
  await cardsStore.fetchCards()
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
