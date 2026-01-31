class Timer {
  constructor () {
    this.interval = null
    this.remainingTime = 0
    this.startTime = null
  }

  start (seconds, onTimeout) {
    this.stop() // Ensure any previous timer is cleared before starting a new one
    this.remainingTime = seconds
    this.startTime = Date.now()

    const timerEl = document.getElementById('timer')
    this.interval = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - this.startTime) / 1000)
      const timeLeft = seconds - elapsedTime

      if (timeLeft <= 0) {
        this.stop() // Stop the timer
        onTimeout() // Trigger the timeout callback
      } else {
        if (timerEl) timerEl.textContent = `Time left: ${timeLeft}`
      }
    }, 500)
  }

  stop () {
    if (this.interval) {
      clearInterval(this.interval) // Stop the timer
      this.interval = null // Reset the interval reference
    }
  }

  getElapsedTime () {
    return this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0
  }

  reset () {
    this.stop() // Stop the timer
    this.remainingTime = 0 // Reset remaining time
    this.startTime = null // Clear start time
  }
}

export default Timer
