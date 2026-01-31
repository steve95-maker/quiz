import Quiz from './quiz.js'
import HighScore from './highscore.js'

const app = document.getElementById('app')

const renderView = (view) => {
  app.innerHTML = ''
  app.appendChild(view)
}

const renderStartScreen = () => {
  const highscore = new HighScore(renderView)
  const quiz = new Quiz(renderView, renderStartScreen, highscore)

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
      quiz.start(nickname)
    } else {
      alert('Please enter a nickname to start!')
    }
  })

  startScreen.querySelector('#highscore-btn').addEventListener('click', () => {
    highscore.show()
  })

  renderView(startScreen)
}

renderStartScreen()
