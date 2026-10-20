import confetti from 'canvas-confetti'

function isDomAvailable(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof document.createElement === 'function'
}

export function triggerConfetti() {
  if (!isDomAvailable()) return
  try {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    })
  } catch (e) {
    // Graceful fallback
  }
}

export function triggerLevelUpConfetti() {
  if (!isDomAvailable()) return
  try {
    const duration = 2.5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 }
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 }
      })
    }, 250)
  } catch (e) {
    // Graceful fallback
  }
}

export function triggerRewardConfetti() {
  if (!isDomAvailable()) return
  try {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
    })
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#fbbf24', '#f59e0b', '#d97706', '#10b981']
    })
  } catch (e) {
    // Graceful fallback
  }
}
