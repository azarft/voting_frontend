<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../stores/admin'

const adminStore = useAdminStore()
const title = ref('')
const optionsText = ref('')
const activateId = ref<number | null>(null)

const parsedOptions = computed(() =>
  optionsText.value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
)

const canSubmit = computed(() => title.value.trim().length > 0 && parsedOptions.value.length >= 2)

onMounted(() => {
  adminStore.loadSessions()
})

const handleCreateSession = async () => {
  if (!canSubmit.value) return
  await adminStore.createSession(title.value.trim(), parsedOptions.value)
  title.value = ''
  optionsText.value = ''
}

const handleActivate = async () => {
  if (!activateId.value) return
  await adminStore.activateSession(activateId.value)
}

const handleClose = async (sessionId: number) => {
  await adminStore.closeSession(sessionId)
}

const handleDelete = async (sessionId: number) => {
  await adminStore.deleteSession(sessionId)
}
</script>

<template>
  <section class="page">
    <div class="panel">
      <header class="header">
        <p class="eyebrow">Admin Console</p>
        <h1>Manage Voting Sessions</h1>
        <p class="subtitle">Create and activate sessions for the live show.</p>
      </header>

      <div class="grid">
        <div class="card">
          <h2>Create Session</h2>
          <label class="field">
            <span>Title</span>
            <input v-model="title" type="text" placeholder="Лучший язык программирования 2024" />
          </label>
          <label class="field">
            <span>Options (one per line)</span>
            <textarea v-model="optionsText" rows="5" placeholder="Java&#10;Kotlin&#10;Python"></textarea>
          </label>
          <button class="primary-button" type="button" :disabled="adminStore.isLoading || !canSubmit" @click="handleCreateSession">
            {{ adminStore.isLoading ? 'Creating…' : 'Create session' }}
          </button>
        </div>

        <div class="card">
          <h2>Activate Session</h2>
          <label class="field">
            <span>Session ID</span>
            <input v-model.number="activateId" type="number" min="1" placeholder="1" />
          </label>
          <button class="primary-button alt" type="button" :disabled="adminStore.isLoading" @click="handleActivate">
            {{ adminStore.isLoading ? 'Activating…' : 'Activate session' }}
          </button>

          <div v-if="adminStore.lastCreatedSession" class="info-block">
            <p class="info-title">Last created session</p>
            <p>ID: {{ adminStore.lastCreatedSession.id }}</p>
            <p>{{ adminStore.lastCreatedSession.title }}</p>
          </div>
        </div>
      </div>

      <div class="sessions">
        <div class="sessions-header">
          <h2>All Sessions</h2>
          <button class="ghost-button" type="button" :disabled="adminStore.isLoading" @click="adminStore.loadSessions">
            Refresh
          </button>
        </div>
        <div v-if="adminStore.sessions.length === 0" class="empty-state">
          No sessions found.
        </div>
        <div v-for="session in adminStore.sessions" :key="session.id" class="session-card">
          <div class="session-meta">
            <div>
              <p class="session-title">{{ session.title }}</p>
              <p class="session-subtitle">ID: {{ session.id }} · Status: {{ session.status }}</p>
            </div>
            <div class="session-actions">
              <button
                class="ghost-button"
                type="button"
                :disabled="adminStore.isLoading"
                @click="adminStore.activateSession(session.id)"
              >
                Activate
              </button>
              <button
                class="ghost-button"
                type="button"
                :disabled="adminStore.isLoading || session.status !== 'ACTIVE'"
                @click="handleClose(session.id)"
              >
                Close
              </button>
              <button
                class="ghost-button danger"
                type="button"
                :disabled="adminStore.isLoading || session.status === 'ACTIVE'"
                @click="handleDelete(session.id)"
              >
                Delete
              </button>
            </div>
          </div>
          <div class="options">
            <span v-for="option in session.options" :key="option.id" class="chip">
              {{ option.text }}
            </span>
          </div>
        </div>
      </div>

      <p v-if="adminStore.statusMessage" class="status-message">{{ adminStore.statusMessage }}</p>
      <p v-if="adminStore.errorMessage" class="status-message error">{{ adminStore.errorMessage }}</p>
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
  width: min(960px, 100%);
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

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.sessions {
  margin-top: 28px;
  display: grid;
  gap: 16px;
}

.sessions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.empty-state {
  color: #9aa6bc;
}

.session-card {
  background: #141b27;
  border-radius: 18px;
  padding: 16px;
  display: grid;
  gap: 14px;
  box-shadow: 0 10px 24px rgba(10, 14, 24, 0.35);
}

.session-meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.session-title {
  font-weight: 600;
  font-size: 1.05rem;
}

.session-subtitle {
  color: #9aa6bc;
  font-size: 0.9rem;
}

.session-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.card {
  background: #1b212c;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 14px 30px rgba(10, 14, 24, 0.45);
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.field input,
.field textarea {
  border: 1px solid #2d3646;
  border-radius: 14px;
  padding: 12px 14px;
  background: #10141c;
  color: #f1f5ff;
  font-size: 0.95rem;
}

.primary-button {
  width: 100%;
  padding: 12px 18px;
  border-radius: 14px;
  border: none;
  background: #3f7bff;
  color: #f8fbff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-button.alt {
  background: #58f2aa;
  color: #052114;
}

.ghost-button {
  border: 1px solid #2c3b52;
  background: transparent;
  color: #c6d2e6;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.ghost-button:hover:not(:disabled) {
  border-color: #3f7bff;
  color: #f8fbff;
}

.ghost-button.danger {
  border-color: #493144;
  color: #ff9aa5;
}

.ghost-button.danger:hover:not(:disabled) {
  border-color: #ff9aa5;
  color: #ffe4e7;
}

.ghost-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: #0f1622;
  color: #b4c0d5;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.85rem;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(63, 123, 255, 0.35);
}

.info-block {
  margin-top: 16px;
  padding: 12px;
  border-radius: 14px;
  background: #121926;
  color: #b4c0d5;
}

.info-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #f1f5ff;
}

.status-message {
  margin-top: 20px;
  font-weight: 600;
  color: #8ff5c0;
}

.status-message.error {
  color: #ff8b8b;
}
</style>
