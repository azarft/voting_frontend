<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useResultsStore } from '../stores/results'

const resultsStore = useResultsStore()

onMounted(() => {
  resultsStore.startPolling(2500)
})

onUnmounted(() => {
  resultsStore.stopPolling()
})
</script>

<template>
  <section class="page">
    <div class="panel">
      <header class="header">
        <p class="eyebrow">Live Results</p>
        <h1>{{ resultsStore.session?.title ?? 'Audience Vote' }}</h1>
        <p class="subtitle">Updated every few seconds.</p>
      </header>

      <div class="results">
        <div v-if="resultsStore.errorMessage" class="loading error">
          {{ resultsStore.errorMessage }}
        </div>
        <div v-else-if="resultsStore.isLoading && resultsStore.results.length === 0" class="loading">
          Loading live results…
        </div>

        <div v-for="result in resultsStore.results" :key="result.optionId" class="result-row">
          <div class="result-header">
            <span class="label">{{ result.label }}</span>
            <span class="value">{{ result.percentage }}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" :style="{ width: `${result.percentage}%` }"></div>
          </div>
          <div class="votes">{{ result.votes }} votes</div>
        </div>
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
  width: min(820px, 100%);
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

.results {
  display: grid;
  gap: 18px;
}

.result-row {
  background: #1b212c;
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: 0 12px 24px rgba(10, 14, 24, 0.35);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.label {
  font-size: 1.05rem;
  font-weight: 600;
}

.value {
  font-size: 1.1rem;
  color: #58f2aa;
  font-weight: 700;
}

.progress-track {
  width: 100%;
  background: #10141c;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3f7bff, #58f2aa);
  border-radius: inherit;
  transition: width 0.4s ease;
}

.votes {
  margin-top: 8px;
  color: #8d9ab2;
  font-size: 0.9rem;
}

.loading {
  color: #8d9ab2;
}

.loading.error {
  color: #ff8b8b;
}
</style>
