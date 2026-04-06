<template>
  <div>
    <h1>Jouer</h1>

    <div class="lobby-grid">
      <div class="lobby-panel">
        <h2>Créer une partie</h2>
        <div class="panel-content">
          <NSelect
            v-model:value="createDeckId"
            :options="deckOptions"
            placeholder="Sélectionner un deck"
            class="selector"
          />
          <NButton
            type="primary"
            class="action-btn"
            :disabled="!createDeckId"
            @click="handleCreateRoom"
          >
            Créer
          </NButton>
        </div>
      </div>

      <div class="lobby-panel">
        <h2>Parties disponibles</h2>
        <div class="panel-content">
          <div v-if="gameStore.rooms.length > 0" class="rooms-list">
            <div
              v-for="(room, index) in gameStore.rooms"
              :key="room.id"
              class="room-card"
            >
              <h3 class="room-title">Partie #{{ index + 1 }}</h3>
              <p class="host-info">
                Hôte : {{ room.host.socketId.substring(0, 10) }}...
              </p>

              <NSelect
                v-model:value="roomSelections[room.id]"
                :options="deckOptions"
                placeholder="Sélectionner un deck"
              />

              <NButton
                type="primary"
                class="action-btn"
                :disabled="!roomSelections[room.id]"
                @click="handleJoinRoom(room.id)"
              >
                Rejoindre
              </NButton>
            </div>
          </div>

          <div v-else>
            <NEmpty description="Aucune partie disponible"></NEmpty>
          </div>
        </div>
      </div>
    </div>

    <NAlert
      v-if="gameStore.error"
      type="error"
      class="error-alert"
      closable
      @after-leave="gameStore.error = null"
    >
      {{ gameStore.error }}
    </NAlert>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useGameStore } from '@/store/game'
import type { Deck } from '@/types'

defineOptions({
  name: 'GameLobby',
})

const api = useApi()
const gameStore = useGameStore()

const decks = ref<Deck[]>([])
const createDeckId = ref<number | null>(null)
const roomSelections = reactive<Record<string, number | null>>({})

// Chargement des decks
const loadDecks = async () => {
  try {
    decks.value = await api.getMyDecks()
  } catch (_err) {
    gameStore.error = 'Erreur lors du chargement des decks.'
  }
}

// Sélecteur de decks
const deckOptions = computed(() =>
  decks.value.map((d) => ({
    label: d.name,
    value: d.id,
  })),
)

// Actions du lobby
const handleCreateRoom = () => {
  if (createDeckId.value) {
    gameStore.createRoom(createDeckId.value)
  }
}

// Rejoindre une room
const handleJoinRoom = (roomId: string) => {
  const deckId = roomSelections[roomId]
  if (deckId) {
    gameStore.joinRoom(roomId, deckId)
  }
}

// Connexion au WebSocket
onMounted(() => {
  loadDecks()
  gameStore.connect()
})
</script>

<style scoped>
.lobby-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 30px;
  align-items: start;
}

.lobby-panel {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 24px;
  min-height: 200px;
}

.panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.action-btn {
  width: 100px;
}

.rooms-list {
  display: grid;
  gap: 16px;
}

.room-card {
  border: 1px solid #f0f0f0;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.room-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.host-info {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.error-alert {
  margin-top: 24px;
}
</style>
