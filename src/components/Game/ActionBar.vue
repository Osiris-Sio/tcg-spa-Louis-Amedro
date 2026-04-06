<template>
  <div class="action-bar" :class="{ 'turn-active': isMyTurn }">
    <div>
      <div v-if="isMyTurn" class="status-badge active">Votre tour</div>
      <div v-else class="status-badge waiting">En attente</div>
    </div>

    <div class="message-area">
      <div class="message-text">
        {{ message || "En attente d'une action..." }}
      </div>
    </div>

    <div class="actions-area">
      <button
        class="btn piocher"
        :disabled="!isMyTurn || isDrawDisabled"
        @click="emit('draw')"
      >
        Piocher
      </button>

      <button
        class="btn attaquer"
        :disabled="!isMyTurn || isAttackDisabled"
        @click="emit('attack')"
      >
        Attaquer
      </button>

      <button
        class="btn fin-tour"
        :disabled="!isMyTurn"
        @click="emit('endTurn')"
      >
        Fin de tour
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Barre d'actions horizontale selon le design de la capture d'écran
 */
defineProps<{
  isMyTurn: boolean
  isDrawDisabled: boolean
  isAttackDisabled: boolean
  message: string
}>()

const emit = defineEmits<(e: 'draw' | 'attack' | 'endTurn') => void>()
</script>

<style scoped>
.action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border: 1px solid #e1e1e6;
  border-left: 0;
  border-right: 0;
  min-height: 60px;
}

.status-badge {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.95rem;
  border: 1px solid transparent;
}

.status-badge.active {
  background-color: #f6ffed;
  color: #52c41a;
  border-color: #b7eb8f;
}

.status-badge.waiting {
  background-color: #f5f5f5;
  color: #8c8c8c;
  border-color: #d9d9d9;
}

.message-area {
  flex: 1;
  text-align: center;
}

.message-text {
  font-style: italic;
  font-size: 0.9rem;
  color: #8c8c8c;
}

.actions-area {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  font-size: 0.9rem;
  min-width: 100px;
}

.btn.piocher {
  background: #fff;
  border-color: #d9d9d9;
  color: #333;
}

.btn.attaquer {
  background: #ff4d4f;
  border-color: #ff4d4f;
  color: white;
}

.btn.fin-tour {
  background: #ffa940;
  border-color: #ffa940;
  color: white;
}

.btn:disabled {
  background: #f5f5f5 !important;
  border-color: #d9d9d9 !important;
  color: #b7b7b7 !important;
  cursor: not-allowed !important;
}
</style>
