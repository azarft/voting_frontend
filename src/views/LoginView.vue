<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)

const isAlatooEmail = computed(() => email.value.trim().toLowerCase().endsWith('@alatoo.edu.kg'))

const handleLogin = async () => {
  if (!email.value.trim()) {
    errorMessage.value = 'Please enter your email to continue.'
    return
  }
  if (!isAlatooEmail.value) {
    errorMessage.value = 'Use your @alatoo.edu.kg email address.'
    return
  }
  if (!password.value.trim()) {
    errorMessage.value = 'Please enter your password.'
    return
  }

  errorMessage.value = null
  try {
    await authStore.login(email.value.trim(), password.value.trim())
    router.push('/admin')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Login failed.'
  }
}

const continueAsViewer = () => {
  router.push('/vote')
}
</script>

<template>
  <section class="page">
    <div class="card">
      <h1 class="title">TV Voting Console</h1>
      <p class="subtitle">Admin access only. Viewers can continue without login.</p>

      <label class="field">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="user@alatoo.edu.kg"
          autocomplete="email"
        />
      </label>

      <label class="field">
        <span>Password</span>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
        />
      </label>

      <button class="primary-button" type="button" :disabled="authStore.isLoading" @click="handleLogin">
        {{ authStore.isLoading ? 'Signing in…' : 'Admin Login' }}
      </button>

      <button class="ghost-button" type="button" @click="continueAsViewer">Continue as viewer</button>

      <p v-if="errorMessage" class="helper-text error">{{ errorMessage }}</p>
      <p v-else class="helper-text">Only @alatoo.edu.kg emails are allowed.</p>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 120px);
  padding: 24px;
}

.card {
  width: min(420px, 100%);
  padding: 32px;
  border-radius: 24px;
  background: #1b212c;
  box-shadow: 0 24px 60px rgba(10, 14, 24, 0.55);
}

.title {
  font-size: 2rem;
  margin-bottom: 8px;
}

.subtitle {
  color: #b4c0d5;
  margin-bottom: 24px;
}

.field {
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.field input {
  border: 1px solid #2d3646;
  border-radius: 14px;
  padding: 14px 16px;
  background: #10141c;
  color: #f1f5ff;
  font-size: 1rem;
}

.primary-button {
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #3f7bff;
  color: #f8fbff;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary-button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(63, 123, 255, 0.35);
}

.ghost-button {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #2c3b52;
  background: transparent;
  color: #c6d2e6;
  cursor: pointer;
}

.helper-text {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #91a0ba;
}

.helper-text.error {
  color: #ff8b8b;
}
</style>
