<template>
  <div class="card-grid">
    <Card
      v-for="id in cardIds"
      :key="id"
      :card-id="id"
      :size="size"
      :selected="isSelected(id)"
      :disabled="isDisabled(id)"
      @click="toggleSelection(id)"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card/Card.vue'

// Définition des propriétés du composant
interface Props {
  cardIds: number[]
  modelValue?: number[]
  max?: number
  size?: 'sm' | 'md'
}

// Propriétés par défaut du composant
const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  max: 10,
  size: 'md',
})

const emit = defineEmits(['update:modelValue'])

// Vérifie si une carte est actuellement dans la sélection
const isSelected = (cardId: number) => props.modelValue?.includes(cardId)

// Désactive les cartes non sélectionnées si le nombre maximum est atteint
const isDisabled = (cardId: number) => {
  if (!props.modelValue || props.max === undefined) return false
  return props.modelValue.length >= props.max && !isSelected(cardId)
}

// Gère la sélection/désélection d'une carte au clic
const toggleSelection = (cardId: number) => {
  if (!props.modelValue) return // Ne rien faire si on n'est pas en mode sélection

  const newSelection = [...props.modelValue] // Copie de la sélection actuelle
  const index = newSelection.indexOf(cardId) // Index de la carte dans la sélection

  if (index > -1) {
    // Désélection si déjà présente
    newSelection.splice(index, 1)
  } else if (props.max === undefined || newSelection.length < props.max) {
    // Sélection si la limite n'est pas atteinte
    newSelection.push(cardId)
  }

  emit('update:modelValue', newSelection)
}
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 0fr));
}
</style>
