import Timer from './timer.js'

class Quiz {
  constructor (renderView, renderStartScreen, highscore) {
    this.renderView = renderView
    this.renderStartScreen = renderStartScreen // Callback to render start screen
    this.highscore = highscore // HighScore instance to show scores
    this.timer = null
    this.nickname = ''
    this.currentQuestion = null
    this.nextURL = 'https://courselab.lnu.se/quiz/question/1'
    this.totalTime = 0 // To track total time for all questions
  }

  async start (nickname) {
    this.nickname = nickname
    this.timer = new Timer() // Reset timer instance for a fresh game
    await this.fetchQuestion()
  }

  async fetchQuestion () {
    try {
      const response = await fetch(this.nextURL)
      this.currentQuestion = await response.json()
      this.showQuestion()
    } catch (error) {
      console.error('Error fetching question:', error)
      this.showGameOver('Failed to fetch the question! Game over.')
    }
  }

  showQuestion () {
    const questionScreen = document.createElement('div')
    questionScreen.innerHTML = `
      <h2>${this.currentQuestion.question}</h2>
      <div id="answers"></div>
      <p id="timer">Time left: 10</p>
    `

    const answersDiv = questionScreen.querySelector('#answers')
    if (this.currentQuestion.alternatives) {
      for (const [key, value] of Object.entries(
        this.currentQuestion.alternatives
      )) {
        const button = document.createElement('button')
        button.textContent = value
        button.addEventListener('click', () => this.submitAnswer(key))
        answersDiv.appendChild(button)
      }
    } else {
      const input = document.createElement('input')
      const submitBtn = document.createElement('button')
      submitBtn.textContent = 'Submit'
      submitBtn.addEventListener('click', () => this.submitAnswer(input.value))
      answersDiv.appendChild(input)
      answersDiv.appendChild(submitBtn)
    }

    this.renderView(questionScreen)
    this.timer.start(10, () => this.showGameOver("Time's up! Game over."))
  }

  async submitAnswer (answer) {
    try {
      const response = await fetch(this.currentQuestion.nextURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      })

      // Handle non-2xx HTTP status codes (e.g., 400)
      if (!response.ok) {
        const errorResult = await response.json()
        console.log('Server Error:', errorResult.message)

        this.timer.stop()
        this.showGameOver('Wrong answer! Game over.')
        return
      }

      // Process successful response
      const result = await response.json()
      console.log(result.message)

      // Update total time
      this.totalTime += this.timer.getElapsedTime()

      // Generate confetti on correct answer
      this.generateConfetti()

      if (result.nextURL) {
        this.nextURL = result.nextURL
        this.fetchQuestion()
      } else {
        this.timer.stop()
        this.showVictoryScreen()
      }
    } catch (error) {
      console.error('Error submitting answer:', error)
      this.showGameOver('An error occurred! Game over.')
    }
  }

  async showVictoryScreen () {
    const victoryScreen = document.createElement('div')
    victoryScreen.innerHTML = `
      <h2>Congratulations, ${this.nickname}! You completed the quiz!</h2>
      <p>Your time: ${this.totalTime} seconds</p>
      <button id="restart-btn">Play Again</button>
    `

    victoryScreen
      .querySelector('#restart-btn')
      .addEventListener('click', () => {
        this.resetGame()
      })

    // Save high score
    this.highscore.save({
      nickname: this.nickname,
      time: this.totalTime
    })
    this.renderView(victoryScreen)
  }

  showGameOver (message = 'Game Over') {
    this.timer.stop()
    const gameOverScreen = document.createElement('div')
    gameOverScreen.innerHTML = `
      <h2>${message}</h2>
      <button id="restart-btn">Play Again</button>
      <button id="highscore-btn">High Scores</button>
    `

    gameOverScreen
      .querySelector('#restart-btn')
      .addEventListener('click', () => {
        this.resetGame()
      })

    gameOverScreen
      .querySelector('#highscore-btn')
      .addEventListener('click', () => {
        this.highscore.show()
      })

    this.renderView(gameOverScreen)
  }

  resetGame () {
    // Stop the timer if running
    if (this.timer) {
      this.timer.stop()
    }

    // Reset game state
    this.nextURL = 'https://courselab.lnu.se/quiz/question/1'
    this.currentQuestion = null
    this.nickname = ''

    // Navigate back to the start screen
    this.renderStartScreen()
  }

  generateConfetti () {
    const colors = ['#ffcc00', '#ff6699', '#66ccff', '#66ff66', '#ff6666']
    const body = document.body

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.classList.add('confetti')
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.setProperty(
        '--color',
        colors[Math.floor(Math.random() * colors.length)]
      )
      confetti.style.animationDelay = `${Math.random() * 2}s`

      body.appendChild(confetti)

      // Remove confetti after animation ends
      setTimeout(() => {
        confetti.remove()
      }, 2000)
    }
  }
}

export default Quiz
