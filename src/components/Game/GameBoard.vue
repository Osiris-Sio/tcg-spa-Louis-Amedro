<template>
  <div :class="isOpponent ? 'opponent' : 'player'">
    <div class="board-header">
      <h3>{{ isOpponent ? 'Adversaire' : 'Vous' }}</h3>
      <div class="ko-counter">{{ state.score }}/3 KO</div>
    </div>

    <div class="active-area">
      <div v-if="state.activeCard">
        <PokemonCard
          :card-id="state.activeCard.id"
          :current-hp="state.activeCard.currentHP"
          size="sm"
        />
      </div>
      <div v-else class="card-placeholder">
        <div class="placeholder-text">Emplacement vide</div>
      </div>
    </div>

    <div v-if="!isOpponent">
      <div>Main ({{ (state as any).hand.length }}/5)</div>
      <div class="hand-container-border">
        <slot name="hand"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/Card/Card.vue'
import type { OpponentGameState, PlayerGameState } from '@/types'

/**
 * Composant représentant une zone de joueur selon le style de l'image
 */
defineProps<{
  state: PlayerGameState | OpponentGameState
  isOpponent?: boolean
}>()
</script>

<style scoped>
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.ko-counter {
  padding: 4px 12px;
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
}

.active-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 380px;
  margin: 20px 0;
}

.card-placeholder {
  width: 140px;
  height: 200px;
  background: rgba(0, 0, 0, 0.02);
  border: 1px dashed #e0e0e0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hand-container-border {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 8px;
  min-height: 180px;
}
</style>
