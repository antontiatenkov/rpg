<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { 
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
  a.download = `reach-personal-goals-backup-${dateStr}.json`
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
  <div class="space-y-8 max-w-2xl">
    <!-- Header -->
    <div>
      <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Настройки
      </h2>
      <p class="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        Параметры сброса дня, интерфейс и управление данными
      </p>
    </div>

    <!-- Section: Time & Logic -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-6">
      <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Время и анимации
      </h3>

      <!-- Day Reset Hour -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <label class="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">
            Сброс ежедневных задач
          </label>
          <p class="text-xs text-zinc-400 mt-0.5 max-w-sm leading-relaxed">
            Час, когда день считается завершенным. Для тех, кто бодрствует за полночь, удобно выставить 03:00 или 04:00.
          </p>
        </div>

        <select
          :value="store.settings.dayResetHour"
          @change="handleResetHourChange"
          class="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
        >
          <option v-for="h in HOURS" :key="h.value" :value="h.value">
            {{ h.label }} {{ h.value === 0 ? '(Полночь)' : '' }}
          </option>
        </select>
      </div>

      <!-- Celebrations Toggle -->
      <div class="flex items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <div>
          <span class="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">
            Анимация конфетти
          </span>
          <p class="text-xs text-zinc-400 mt-0.5">
            Конфетти при получении нового уровня и покупке наград.
          </p>
        </div>

        <button
          @click="handleCelebrationsToggle"
          :class="[
            'w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0',
            store.settings.celebrationsEnabled ? 'bg-zinc-900 dark:bg-zinc-100 justify-end' : 'bg-zinc-200 dark:bg-zinc-800 justify-start'
          ]"
        >
          <span :class="['w-4.5 h-4.5 rounded-full transition-colors', store.settings.celebrationsEnabled ? 'bg-white dark:bg-zinc-900 shadow-xs' : 'bg-zinc-400 dark:bg-zinc-600']"></span>
        </button>
      </div>
    </div>

    <!-- Section: Appearance -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
      <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Тема оформления
      </h3>

      <div class="grid grid-cols-3 gap-2">
        <button
          @click="handleThemeChange('dark')"
          :class="[
            'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer',
            store.settings.theme === 'dark'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          ]"
        >
          <Moon class="w-3.5 h-3.5" />
          Темная
        </button>

        <button
          @click="handleThemeChange('light')"
          :class="[
            'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer',
            store.settings.theme === 'light'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          ]"
        >
          <Sun class="w-3.5 h-3.5" />
          Светлая
        </button>

        <button
          @click="handleThemeChange('system')"
          :class="[
            'flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-medium transition-all cursor-pointer',
            store.settings.theme === 'system'
              ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-xs'
              : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          ]"
        >
          Системная
        </button>
      </div>
    </div>

    <!-- Section: Data Management -->
    <div class="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs space-y-4">
      <h3 class="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Резервное копирование
      </h3>
      <p class="text-xs text-zinc-400 leading-relaxed">
        Все данные хранятся локально в вашем браузере. Вы можете сохранить копию в JSON-файл или перенести её на другое устройство.
      </p>

      <div class="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          @click="handleExport"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-medium transition-all cursor-pointer"
        >
          <Download class="w-3.5 h-3.5" />
          Скачать JSON
        </button>

        <button
          @click="triggerImportClick"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs font-medium transition-all cursor-pointer"
        >
          <Upload class="w-3.5 h-3.5" />
          Загрузить из файла
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
      <div v-if="importSuccess" class="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
        <Check class="w-4 h-4" />
        Данные успешно восстановлены!
      </div>
      <div v-if="importError" class="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-medium flex items-center gap-2">
        <AlertTriangle class="w-4 h-4" />
        Ошибка чтения файла бэкапа. Проверьте формат JSON.
      </div>
    </div>

    <!-- Danger Zone: Reset -->
    <div class="p-5 sm:p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 space-y-3">
      <h3 class="text-sm font-semibold text-rose-500">
        Сброс прогресса
      </h3>
      <p class="text-xs text-zinc-400">
        Очистить все задачи, награды, историю и начать заново с 1 уровня.
      </p>

      <button
        @click="showResetConfirm = true"
        class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        Сбросить весь прогресс
      </button>
    </div>

    <!-- Reset Confirm Modal -->
    <div 
      v-if="showResetConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
    >
      <div class="relative w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl text-center">
        <h3 class="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Сбросить весь прогресс?
        </h3>
        <p class="text-xs text-zinc-400 mb-6 leading-relaxed">
          Все ваши уровни, опыт, задачи и накопленное золото будут удалены. Это действие необратимо.
        </p>
        <div class="flex items-center gap-2">
          <button
            @click="showResetConfirm = false"
            class="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Отмена
          </button>
          <button
            @click="confirmReset"
            class="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-all cursor-pointer shadow-xs"
          >
            Да, сбросить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
