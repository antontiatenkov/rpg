<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import Header from './components/Header.vue'
import BottomNav from './components/BottomNav.vue'
import TasksView from './components/TasksView.vue'
import RewardsView from './components/RewardsView.vue'
import StatsView from './components/StatsView.vue'
import SettingsView from './components/SettingsView.vue'
import LevelUpModal from './components/LevelUpModal.vue'

const store = useGameStore()
const activeTab = ref<'tasks' | 'rewards' | 'stats' | 'settings'>('tasks')

function handleVisibilityChange() {
  if (document.visibilityState === 'visible') {
    store.checkDayRollover()
  }
}

onMounted(() => {
  store.initApp()
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <div class="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
    <!-- Top Header -->
    <Header />

    <!-- Main Content View with generous bottom space for bottom nav -->
    <main class="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 sm:pb-32">
      <TasksView v-if="activeTab === 'tasks'" />
      <RewardsView v-else-if="activeTab === 'rewards'" />
      <StatsView v-else-if="activeTab === 'stats'" />
      <SettingsView v-else-if="activeTab === 'settings'" />
    </main>

    <!-- Clean, quiet footer -->
    <footer class="py-6 pb-24 sm:pb-28 text-center text-xs text-zinc-400 dark:text-zinc-600 border-t border-zinc-200/60 dark:border-zinc-800/60">
      <p>Reach Personal Goals</p>
    </footer>

    <!-- Bottom Ribbon Navbar -->
    <BottomNav :active-tab="activeTab" @update:active-tab="activeTab = $event" />

    <!-- Level Up Modal -->
    <LevelUpModal />
  </div>
</template>
