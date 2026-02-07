<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useVotingStore } from '../stores/voting'
import OptionCard from '../components/OptionCard.vue'

const votingStore = useVotingStore()

onMounted(() => {
  votingStore.loadSession()
})

const isSubmitDisabled = computed(() => {
  return votingStore.isSubmitting || votingStore.hasVoted || votingStore.selectedOptionId === null
})

const handleSelect = (optionId: number) => {
  votingStore.selectOption(optionId)
}

const handleSubmit = async () => {
  await votingStore.submitSelectedVote()
}
</script>

<template>
  <section class="page">
    <div class="panel">
      <header class="header">
        <p class="eyebrow">Live Voting Session</p>
        <h1>{{ votingStore.sessionTitle }}</h1>
        <p class="subtitle">Select one option and submit your vote.</p>
      </header>

      <div class="options-grid">
        <div v-if="votingStore.errorMessage" class="status-message error">
          {{ votingStore.errorMessage }}
        </div>
        <div v-else-if="votingStore.options.length === 0" class="status-message">
          Loading active session…
        </div>
        <OptionCard
          v-for="option in votingStore.options"
          :key="option.id"
          :option="option"
          :selected="option.id === votingStore.selectedOptionId"
          :disabled="votingStore.hasVoted || !votingStore.isActive"
          @select="handleSelect"
        />
      </div>

      <div class="actions">
        <button class="primary-button" type="button" :disabled="isSubmitDisabled" @click="handleSubmit">
          {{ votingStore.isSubmitting ? 'Submitting…' : 'Submit Vote' }}
        </button>
        <p v-if="votingStore.statusMessage" class="status-message">{{ votingStore.statusMessage }}</p>
        <p v-else-if="votingStore.errorMessage" class="status-message error">{{ votingStore.errorMessage }}</p>
        <p v-else-if="!votingStore.isActive" class="status-message">Voting is not active.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  padding: 32px 20px 60px;
}

.panel {
  width: min(920px, 100%);
}

.header {
  margin-bottom: 24px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  color: #7c8aa5;
  margin-bottom: 8px;
}

.subtitle {
  color: #a6b2c8;
  margin-top: 6px;
}

.options-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.actions {
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.primary-button {
  min-width: 220px;
  padding: 14px 24px;
  border-radius: 16px;
  border: none;
  background: #58f2aa;
  color: #052114;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(88, 242, 170, 0.2);
}

.status-message {
  color: #8ff5c0;
  font-weight: 600;
}

.status-message.error {
  color: #ff8b8b;
}
</style>
