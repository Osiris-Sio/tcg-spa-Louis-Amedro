<template>
  <div v-if="gameStore.game" class="game-view">
    <GameBoard :state="gameStore.game.opponent" is-opponent />

    <ActionBar
      :is-my-turn="gameStore.isMyTurn"
      :is-draw-disabled="isDrawDisabled"
      :is-attack-disabled="isAttackDisabled"
      :message="gameStore.message"
      @draw="gameStore.drawCards"
      @attack="gameStore.attack"
      @end-turn="gameStore.endTurn"
    />

    <GameBoard :state="gameStore.game.you">
      <template #hand>
        <PlayerHand
          :hand="gameStore.game.you.hand"
          :can-play="canPlay"
          @play="gameStore.playCard"
        />
      </template>
    </GameBoard>

    <div class="deck-footer">
      Deck : {{ gameStore.game.you.deckSize }} cartes
    </div>

    <EndGameModal
      :winner="gameStore.winner"
      :game="gameStore.game"
      :my-score="gameStore.myFinalScore"
      :opponent-score="gameStore.opponentFinalScore"
      @leave="handleLeave"
    />
  </div>

  <!-- État de chargement si les données ne sont pas prêtes -->
  <div v-else class="loading-view">
    <NSpin size="large" />
    <p>Synchronisation avec le terrain...</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import ActionBar from '@/components/Game/ActionBar.vue'
import EndGameModal from '@/components/Game/EndGameModal.vue'
import GameBoard from '@/components/Game/GameBoard.vue'
import PlayerHand from '@/components/Game/PlayerHand.vue'
import { ROUTES } from '@/router'
import { useGameStore } from '@/store/game'

const gameStore = useGameStore()
const router = useRouter()

// Bouton Piocher (Main max 5 ou deck vide)
const isDrawDisabled = computed(() => {
  if (!gameStore.game) return true
  return (
    gameStore.game.you.hand.length >= 5 || gameStore.game.you.deckSize === 0
  )
})

// Bouton Attaquer (Nécessite carte active de chaque côté)
const isAttackDisabled = computed(() => {
  if (!gameStore.game) return true
  return !gameStore.game.you.activeCard || !gameStore.game.opponent.activeCard
})

// Jouer carte (Turn + pas de carte active)
const canPlay = computed(() => {
  if (!gameStore.game) return false
  return gameStore.isMyTurn && !gameStore.game.you.activeCard
})

// Quitter la partie
const handleLeave = () => {
  gameStore.resetGame()
  router.push(ROUTES.HOME)
}
</script>

<style scoped>
.game-view {
  background: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 40px;
  max-width: 1400px;
}

.loading-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  color: #666;
}

.deck-footer {
  margin-top: auto;
  padding: 20px 0;
  color: #888;
  font-size: 0.95rem;
  border-top: 2px solid #333;
}
</style>
