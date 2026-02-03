<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="brand">
        <span class="brand-dot"></span>
        <span>Live TV Voting</span>
      </div>
      <nav class="nav-links">
        <RouterLink to="/vote" class="nav-link">Vote</RouterLink>
        <RouterLink to="/results" class="nav-link">Results</RouterLink>
        <RouterLink
          v-if="authStore.email === 'argen.azanov@alatoo.edu.kg'"
          to="/admin"
          class="nav-link"
        >
          Admin
        </RouterLink>
        <button v-if="authStore.isAuthenticated" class="ghost-button" type="button" @click="handleLogout">
          Logout
        </button>
      </nav>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-bottom: 1px solid #1f2530;
  background: rgba(14, 18, 26, 0.85);
  backdrop-filter: blur(12px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.brand-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #58f2aa;
  box-shadow: 0 0 12px rgba(88, 242, 170, 0.6);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.nav-link {
  color: #c6d2e6;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 999px;
  transition: background 0.2s ease;
}

.nav-link.router-link-active {
  background: #1f2b3d;
  color: #f8fbff;
}

.ghost-button {
  border: 1px solid #2c3b52;
  background: transparent;
  color: #c6d2e6;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.ghost-button:hover {
  border-color: #3f7bff;
  color: #f8fbff;
}

.app-main {
  flex: 1;
}

@media (max-width: 720px) {
  .app-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
