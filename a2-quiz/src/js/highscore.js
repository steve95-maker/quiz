class HighScore {
  constructor (renderView) {
    this.renderView = renderView
    this.key = 'quiz_highscores'
  }

  save (score) {
    const scores = JSON.parse(localStorage.getItem(this.key)) || []
    scores.push(score)
    scores.sort((a, b) => a.time - b.time) // Sort by time (ascending)
    localStorage.setItem(this.key, JSON.stringify(scores.slice(0, 5))) // Keep top 5
  }

  show () {
    const highScoreScreen = document.createElement('div')
    highScoreScreen.innerHTML = '<h2>High Scores</h2>'
    // Retrieve scores or use an empty array if none exist
    const scores = JSON.parse(localStorage.getItem(this.key)) || []
    const list = document.createElement('ol')
    // Populate high score list
    scores.forEach((score) => {
      const listItem = document.createElement('li')
      listItem.textContent = `${score.nickname}: ${score.time} seconds`
      list.appendChild(listItem)
    })

    highScoreScreen.appendChild(list)
    // Add a Back button
    const backBtn = document.createElement('button')
    backBtn.textContent = 'Back'
    backBtn.addEventListener('click', () => {
    // Programmatically navigate back to the start screen
      this.renderView(this.createStartScreen())
    })
    highScoreScreen.appendChild(backBtn)
    // Render the high scores view
    this.renderView(highScoreScreen)
  }

  // Helper to recreate the start screen
  createStartScreen () {
    const startScreen = document.createElement('div')
    startScreen.innerHTML = `
      <h1>Quiz Game</h1>
      <input id="nickname" type="text" placeholder="Enter your nickname" />
      <button id="start-btn">Start Quiz</button>
      <button id="highscore-btn">High Scores</button>
    `

    startScreen.querySelector('#start-btn').addEventListener('click', () => {
      const nickname = startScreen.querySelector('#nickname').value
      if (nickname.trim()) {
        this.startGame(nickname) // Ensure startGame is handled outside or passed in
      } else {
        alert('Please enter a nickname to start!')
      }
    })

    startScreen.querySelector('#highscore-btn').addEventListener('click', () => {
      this.show()
    })

    return startScreen
  }
}

export default HighScore
