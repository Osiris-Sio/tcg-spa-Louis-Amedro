<template>
  <NCard
    v-if="card"
    :class="['pokemon-card', { selected, disabled }, props.size]"
    @click="handleClick"
  >
    <div>
      <img :src="card.imgUrl" :alt="card.name" />
    </div>

    <div>
      <p>#{{ card.pokedexNumber }}</p>
      <p>
        <strong>{{ card.name }}</strong>
      </p>
      <p class="type">{{ card.type }}</p>
      <p>❤️ {{ card.hp }} ⸱ ⚔️ {{ card.attack }}</p>

      <div v-if="currentHp !== undefined">
        <NProgress
          type="line"
          :percentage="hpPercentage"
          :color="hpBarColor"
          :show-indicator="false"
        />
        <span class="hp-text">{{ currentHp }} / {{ card.hp }} HP</span>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'PokemonCard',
})

import { useColors } from '@/composables/useColors'
import { useCardsStore } from '@/store/cards'

const colors = useColors()
const cardsStore = useCardsStore()

// Définition des propriétés du composant
interface Props {
  cardId: number
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

// Propriétés par défaut du composant
const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  disabled: false,
  currentHp: undefined,
})

// Récupération de la carte depuis le store
const card = computed(() => {
  return cardsStore.getCardById(props.cardId)
})

const emit = defineEmits(['click'])

// Détermine la couleur associée au type du Pokémon
const typeColor = computed(() => {
  if (!card.value) {
    return '#ccc' // Si la carte n'est pas trouvée, retourne une couleur grise
  }
  return colors.getTypeColor(card.value.type)
})

// Calcul du pourcentage de PV restants pour la barre de progression
const hpPercentage = computed(() => {
  if (props.currentHp === undefined || !card.value) return 100
  return Math.max(0, Math.min(100, (props.currentHp / card.value.hp) * 100))
})

// Calcul de la couleur de la barre de progression
const hpBarColor = computed(() => colors.hpColor(hpPercentage.value))

// Gère le clic sur la carte
const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.cardId)
  }
}
</script>

<style scoped>
.pokemon-card {
  cursor: pointer;
  justify-self: center;
  margin: 10px;
}

.pokemon-card.sm {
  max-width: 200px;
}
.pokemon-card.md {
  max-width: 300px;
}

img {
  width: 100%;
  height: auto;
}

.pokemon-card.selected {
  border: 4px solid green;
  background: rgba(0, 255, 0, 0.1);
}
.pokemon-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

p {
  text-align: center;
  margin: 5px;
}

.type {
  color: white;
  padding: 5px 10px;
  background-color: v-bind(typeColor);
  border-radius: 5px;
  width: fit-content;
  margin: 10px auto;
  text-align: center;
}
</style>
