<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Task, TaskType, Difficulty } from '../types'
import TaskCard from './TaskCard.vue'
import TaskModal from './TaskModal.vue'
import { 
  Plus, 
  Calendar, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  Inbox 
} from '@lucide/vue'

const store = useGameStore()

const currentFilter = ref<'all' | 'daily' | 'quest'>('all')
const isModalOpen = ref(false)
const taskToEdit = ref<Task | null>(null)
const defaultTypeForModal = ref<TaskType>('daily')
const showCompletedQuests = ref(false)

const dailyCompletedCount = computed(() => {
  return store.dailyTasks.filter(t => t.completedToday).length
})

const dailyTotalCount = computed(() => store.dailyTasks.length)

const dailyProgressPercent = computed(() => {
  if (dailyTotalCount.value === 0) return 0
  return Math.round((dailyCompletedCount.value / dailyTotalCount.value) * 100)
})

function openNewTaskModal(type: TaskType = 'daily') {
  taskToEdit.value = null
  defaultTypeForModal.value = type
  isModalOpen.value = true
}

function openEditTaskModal(task: Task) {
  taskToEdit.value = task
  isModalOpen.value = true
}

function handleSaveTask(payload: {
  id?: string
  title: string
  description?: string
  type: TaskType
  difficulty: Difficulty
}) {
  if (payload.id) {
    store.updateTask(payload.id, {
      title: payload.title,
      description: payload.description,
      difficulty: payload.difficulty
    })
  } else {
    store.addTask({
      title: payload.title,
      description: payload.description,
      type: payload.type,
      difficulty: payload.difficulty
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Daily Summary & Add Button -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <span>Журнал заданий</span>
          <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
            {{ store.tasks.length }}
          </span>
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Выполняйте регулярные рутины и разовые квесты для роста уровня
        </p>
      </div>

      <!-- Quick Add Buttons -->
      <div class="flex items-center gap-2">
        <button
          @click="openNewTaskModal('daily')"
          class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
        >
          <Plus class="w-4 h-4" />
          <span>Добавить задачу</span>
        </button>
      </div>
    </div>

    <!-- Daily Progress Banner (if daily tasks exist) -->
    <div 
      v-if="dailyTotalCount > 0"
      class="p-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/20 backdrop-blur-sm shadow-sm"
    >
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-2">
          <Calendar class="w-4 h-4 text-indigo-400" />
          <span class="text-xs sm:text-sm font-bold text-slate-200">
            Прогресс ежедневных рутин
          </span>
        </div>
        <span class="text-xs font-bold text-indigo-300">
          {{ dailyCompletedCount }} из {{ dailyTotalCount }} выполнено ({{ dailyProgressPercent }}%)
        </span>
      </div>
      <div class="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40">
        <div 
          class="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
          :style="{ width: `${dailyProgressPercent}%` }"
        ></div>
      </div>
    </div>

    <!-- Filter Pills -->
    <div class="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
      <button
        @click="currentFilter = 'all'"
        :class="[
          'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
          currentFilter === 'all'
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        Все ({{ store.tasks.length }})
      </button>

      <button
        @click="currentFilter = 'daily'"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
          currentFilter === 'daily'
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <Calendar class="w-3.5 h-3.5" />
        Рутины ({{ store.dailyTasks.length }})
      </button>

      <button
        @click="currentFilter = 'quest'"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
          currentFilter === 'quest'
            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        <CheckSquare class="w-3.5 h-3.5" />
        Квесты ({{ store.questTasks.length }})
      </button>
    </div>

    <!-- Empty State -->
    <div 
      v-if="store.tasks.length === 0"
      class="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
    >
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
        <Inbox class="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
        Журнал заданий пока пуст
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
        Добавьте свои регулярные привычки или важные разовые дела. За каждое выполнение вы будете получать опыт и золото!
      </p>
      <button
        @click="openNewTaskModal('daily')"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
      >
        <Plus class="w-4 h-4" />
        Создать первое испытание
      </button>
    </div>

    <!-- Tasks Lists -->
    <div v-else class="space-y-6">
      <!-- Section: Dailies -->
      <section v-if="currentFilter === 'all' || currentFilter === 'daily'">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar class="w-3.5 h-3.5 text-indigo-400" />
            Ежедневные рутины ({{ store.dailyTasks.length }})
          </h3>
          <span class="text-xs text-slate-400">
            Сброс каждый день
          </span>
        </div>

        <div v-if="store.dailyTasks.length === 0" class="text-xs text-slate-500 italic py-2">
          Нет добавленных ежедневных рутин.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaskCard
            v-for="task in store.dailyTasks"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>

      <!-- Section: Active Quests -->
      <section v-if="currentFilter === 'all' || currentFilter === 'quest'">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CheckSquare class="w-3.5 h-3.5 text-indigo-400" />
            Активные квесты ({{ store.activeQuests.length }})
          </h3>
          <span class="text-xs text-slate-400">
            Разовые задачи
          </span>
        </div>

        <div v-if="store.activeQuests.length === 0" class="text-xs text-slate-500 italic py-2">
          Нет активных разовых квестов.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TaskCard
            v-for="task in store.activeQuests"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>

      <!-- Section: Completed Quests (Collapsible) -->
      <section v-if="(currentFilter === 'all' || currentFilter === 'quest') && store.completedQuests.length > 0">
        <button
          @click="showCompletedQuests = !showCompletedQuests"
          class="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-1 transition-colors cursor-pointer"
        >
          <ChevronUp v-if="showCompletedQuests" class="w-4 h-4" />
          <ChevronDown v-else class="w-4 h-4" />
          <span>Завершенные квесты ({{ store.completedQuests.length }})</span>
        </button>

        <div v-if="showCompletedQuests" class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          <TaskCard
            v-for="task in store.completedQuests"
            :key="task.id"
            :task="task"
            @edit="openEditTaskModal"
          />
        </div>
      </section>
    </div>

    <!-- Task Modal -->
    <TaskModal
      :show="isModalOpen"
      :edit-task="taskToEdit"
      :default-type="defaultTypeForModal"
      @close="isModalOpen = false"
      @save="handleSaveTask"
    />
  </div>
</template>
