<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const email = ref('')
const code = ref('')
const errorMessage = ref<string | null>(null)
const infoMessage = ref<string | null>(null)
const step = ref<'request' | 'verify'>('request')

const isAlatooEmail = computed(() => email.value.trim().toLowerCase().endsWith('@alatoo.edu.kg'))

const handleRequestCode = async () => {
  if (!email.value.trim()) {
    errorMessage.value = 'Please enter your email to continue.'
    return
  }
  if (!isAlatooEmail.value) {
    errorMessage.value = 'Use your @alatoo.edu.kg email address.'
    return
  }

  errorMessage.value = null
  infoMessage.value = null
  try {
    await authStore.requestCode(email.value.trim())
    step.value = 'verify'
    infoMessage.value = 'Verification code sent. Check your email.'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Failed to request code.'
  }
}

const handleVerifyCode = async () => {
  if (!code.value.trim()) {
    errorMessage.value = 'Enter the 6-digit verification code.'
    return
  }

  errorMessage.value = null
  infoMessage.value = null
  try {
    await authStore.verifyCode(email.value.trim(), code.value.trim())
    router.push('/vote')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Verification failed.'
  }
}
</script>

<template>
  <section class="page">
    <div class="card">
      <h1 class="title">TV Voting Console</h1>
      <p class="subtitle">Enter your email to join the live session.</p>

      <label class="field">
        <span>Email</span>
        <input
          v-model="email"
          type="email"
          placeholder="user@alatoo.edu.kg"
          autocomplete="email"
          :disabled="step === 'verify'"
        />
      </label>

      <label v-if="step === 'verify'" class="field">
        <span>Verification Code</span>
        <input
          v-model="code"
          type="text"
          inputmode="numeric"
          maxlength="6"
          placeholder="123456"
        />
      </label>

      <button
        v-if="step === 'request'"
        class="primary-button"
        type="button"
        :disabled="authStore.isLoading"
        @click="handleRequestCode"
      >
        {{ authStore.isLoading ? 'Sending…' : 'Send code' }}
      </button>

      <button
        v-else
        class="primary-button"
        type="button"
        :disabled="authStore.isLoading"
        @click="handleVerifyCode"
      >
        {{ authStore.isLoading ? 'Verifying…' : 'Verify & Login' }}
      </button>

      <p v-if="errorMessage" class="helper-text error">{{ errorMessage }}</p>
      <p v-else-if="infoMessage" class="helper-text">{{ infoMessage }}</p>
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

.helper-text {
  margin-top: 16px;
  font-size: 0.9rem;
  color: #91a0ba;
}

.helper-text.error {
  color: #ff8b8b;
}
</style>
