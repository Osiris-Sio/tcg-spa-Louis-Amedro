<template>
  <NModal :show="!!winner" :mask-closable="false">
    <NCard
      style="width: 400px"
      :title="isWinner ? 'Victoire' : 'Défaite'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-content">
        <p class="result-text">
          {{
            isWinner
              ? 'Félicitations ! Vous avez gagné la partie.'
              : "L'adversaire a gagné la partie."
          }}
        </p>

        <div v-if="game" class="score-list">
          <div class="score-line">
            <span>{{ game.you.username }} (Vous)</span>
            <strong
              >{{ myScore !== null ? myScore : game.you.score }} KOs</strong
            >
          </div>
          <div class="score-line">
            <span>{{ game.opponent.username }}</span>
            <strong
              >{{
                opponentScore !== null ? opponentScore : game.opponent.score
              }}
              KOs</strong
            >
          </div>
        </div>
      </div>

      <template #footer>
        <NButton type="primary" block @click="emit('leave')">
          Retour au lobby
        </NButton>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { GameState } from '@/types'

/**
 * Modal affichée automatiquement en fin de partie affichant le vainqueur et le score
 */
const props = defineProps<{
  winner: string | null
  game: GameState | null
  myScore: number | null
  opponentScore: number | null
}>()

const emit = defineEmits<(e: 'leave') => void>()

// Vérification de la victoire
const isWinner = computed(() => {
  return props.winner === props.game?.you.username
})
</script>

<style scoped>
.modal-content {
  text-align: center;
}

.result-text {
  margin-bottom: 24px;
  font-size: 1.1rem;
}

.score-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.score-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
