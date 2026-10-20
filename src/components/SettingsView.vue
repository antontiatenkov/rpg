<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { 
  Clock, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RotateCcw,
  Check,
  AlertTriangle
} from '@lucide/vue'

const store = useGameStore()

const fileInput = ref<HTMLInputElement | null>(null)
const importSuccess = ref(false)
const importError = ref(false)
const showResetConfirm = ref(false)

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: `${String(i).padStart(2, '0')}:00`
}))

function handleResetHourChange(event: Event) {
  const val = Number((event.target as HTMLSelectElement).value)
  store.updateSettings({ dayResetHour: val })
}

function handleThemeChange(theme: 'dark' | 'light' | 'system') {
  store.updateSettings({ theme })
}

function handleCelebrationsToggle() {
  store.updateSettings({ celebrationsEnabled: !store.settings.celebrationsEnabled })
}

function handleExport() {
  const json = store.exportData()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const dateStr = new Date().toISOString().split('T')[0]
  a.href = url
  a.download = `rpg-routine-backup-${dateStr}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function triggerImportClick() {
  fileInput.value?.click()
}

function handleFileSelected(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target?.result as string
    if (content) {
      const ok = store.importData(content)
      if (ok) {
        importSuccess.value = true
        importError.value = false
        setTimeout(() => (importSuccess.value = false), 3500)
      } else {
        importError.value = true
        importSuccess.value = false
        setTimeout(() => (importError.value = false), 3500)
      }
    }
  }
  reader.readAsText(file)
  target.value = ''
}

function confirmReset() {
  store.resetAllProgress()
  showResetConfirm.value = false
}
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <span>Настройки</span>
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
        Параметры сброса дня, внешний вид и управление данными
      </p>
    </div>

    <!-- Group: Gameplay & Time -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
      <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Clock class="w-4 h-4 text-indigo-400" />
        Игровой процесс и время
      </h3>

      <!-- Day Reset Hour -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <label class="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
            Время сброса ежедневных задач
          </label>
          <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-0.5">
            Час, когда день считается завершенным и ежедневные задачи обновляются. Для ночного режима рекомендуется 03:00 или 04:00.
          </p>
        </div>

        <select
          :value="store.settings.dayResetHour"
          @change="handleResetHourChange"
          class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
        >
          <option v-for="h in HOURS" :key="h.value" :value="h.value">
            {{ h.label }} {{ h.value === 0 ? '(Полночь)' : '' }}
          </option>
        </select>
      </div>

      <!-- Celebrations Toggle -->
      <div class="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div>
          <span class="text-sm font-semibold text-slate-800 dark:text-slate-200 block">
            Праздничные эффекты и конфетти
          </span>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Анимация конфетти при получении уровня, выполнении задач и покупке наград.
          </p>
        </div>

        <button
          @click="handleCelebrationsToggle"
          :class="[
            'w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0',
            store.settings.celebrationsEnabled ? 'bg-indigo-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
          ]"
        >
          <span class="w-4 h-4 rounded-full bg-white shadow-sm"></span>
        </button>
      </div>
    </div>

    <!-- Group: Appearance -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Moon class="w-4 h-4 text-indigo-400" />
        Внешний вид
      </h3>

      <div class="grid grid-cols-3 gap-2">
        <button
          @click="handleThemeChange('dark')"
          :class="[
            'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
            store.settings.theme === 'dark'
              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          ]"
        >
          <Moon class="w-4 h-4" />
          Темная
        </button>

        <button
          @click="handleThemeChange('light')"
          :class="[
            'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
            store.settings.theme === 'light'
              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          ]"
        >
          <Sun class="w-4 h-4" />
          Светлая
        </button>

        <button
          @click="handleThemeChange('system')"
          :class="[
            'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer',
            store.settings.theme === 'system'
              ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          ]"
        >
          Системная
        </button>
      </div>
    </div>

    <!-- Group: Backup & Sync -->
    <div class="p-5 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
        <Download class="w-4 h-4 text-indigo-400" />
        Резервное копирование и перенос
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Все данные хранятся локально в вашем браузере. Вы можете в любой момент сохранить резервную копию в файл JSON или перенести прогресс на другое устройство.
      </p>

      <div class="flex flex-wrap items-center gap-3">
        <button
          @click="handleExport"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <Download class="w-4 h-4 text-indigo-400" />
          Скачать бэкап (JSON)
        </button>

        <button
          @click="triggerImportClick"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          <Upload class="w-4 h-4 text-emerald-400" />
          Восстановить из файла
        </button>

        <input
          ref="fileInput"
          type="file"
          accept=".json,application/json"
          class="hidden"
          @change="handleFileSelected"
        />
      </div>

      <!-- Feedback notifications -->
      <div v-if="importSuccess" class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
        <Check class="w-4 h-4" />
        Данные успешно загружены и восстановлены!
      </div>
      <div v-if="importError" class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
        <AlertTriangle class="w-4 h-4" />
        Ошибка чтения файла бэкапа. Убедитесь, что это корректный файл JSON.
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
      <h3 class="text-sm font-bold text-rose-500 flex items-center gap-2">
        <AlertTriangle class="w-4 h-4" />
        Сброс прогресса
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Очистить все задачи, награды, историю и начать заново с 1 уровня.
      </p>

      <button
        @click="showResetConfirm = true"
        class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-semibold transition-all cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        Сбросить весь прогресс
      </button>
    </div>

    <!-- Reset Confirm Modal -->
    <div 
      v-if="showResetConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div class="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-center">
        <div class="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-3">
          <AlertTriangle class="w-6 h-6" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
          Вы уверены?
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-5">
          Все ваши уровни, опыт, задачи и накопленное золото будут безвозвратно удалены.
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="showResetConfirm = false"
            class="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Отмена
          </button>
          <button
            @click="confirmReset"
            class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all cursor-pointer"
          >
            Да, сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
