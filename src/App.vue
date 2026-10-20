<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import Header from './components/Header.vue'
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
  <div class="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
    <!-- Top Header & Navigation -->
    <Header :active-tab="activeTab" @update:active-tab="activeTab = $event" />

    <!-- Main Content View -->
    <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
      <TasksView v-if="activeTab === 'tasks'" />
      <RewardsView v-else-if="activeTab === 'rewards'" />
      <StatsView v-else-if="activeTab === 'stats'" />
      <SettingsView v-else-if="activeTab === 'settings'" />
    </main>

    <!-- Footer -->
    <footer class="py-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-200 dark:border-slate-800/80">
      <p>RPG Routine — Геймификация привычек, ежедневных задач и наград</p>
    </footer>

    <!-- Level Up Celebration Modal -->
    <LevelUpModal />
  </div>
</template>
