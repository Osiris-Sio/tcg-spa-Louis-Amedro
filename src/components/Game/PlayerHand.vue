<template>
  <div class="player-hand">
    <div class="hand-cards">
      <div
        v-for="(card, index) in hand"
        :key="index"
        class="hand-card-wrapper"
        :class="{ playable: canPlay }"
        @click="handlePlay(index)"
      >
        <PokemonCard :card-id="card.id" size="sm" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PokemonCard from '@/components/Card/Card.vue'
import type { Card } from '@/types'

/**
 * Composant de la main du joueur avec style horizontal bordé
 */
const props = defineProps<{
  hand: Card[]
  canPlay: boolean
}>()

const emit = defineEmits<(e: 'play', index: number) => void>()

const handlePlay = (index: number) => {
  if (props.canPlay) {
    emit('play', index)
  }
}
</script>

<style scoped>
.hand-cards {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
}
</style>
