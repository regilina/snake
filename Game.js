import { Snake } from './Snake.js'
import { Apple } from './Apple.js'

const INITIAL_MOVE_DELAY = 500
const MOVE_DELAY_DECREMENT = 20

export class Game {
  constructor (board, snake, apple) {
    this._board = board
    this._snake = snake
    this._apple = apple
    this._score = 0
    this._bestScore = localStorage.getItem('bestScore') || 0
    this._isGameOver = false
  }

  init () {
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
    this._displayBestScore()
    this._addControls()
  }

  _addControls () {
    document.addEventListener('keydown', this._handleKeyPress)

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', () => {
      this._restartGame()
    })

    const board = document.getElementById('board')
    board.addEventListener('click', () => {
      this._startGame()
    })
  }

  _handleKeyPress = (event) => {
    const directionMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    }

    const key = event.key
    const newDirection = directionMap[key]

    if (newDirection && newDirection !== this._snake.direction) {
      this._snake.direction = newDirection
    }
  }

  _updateScore (score) {
    this._score = score
    document.getElementById('score').textContent = this._score
    if (this._score > this._bestScore) {
      this._bestScore = this._score
      this._displayBestScore()
      localStorage.setItem('bestScore', this._bestScore)
    }
  }

  _displayBestScore () {
    document.getElementById('best-score').textContent = this._bestScore
  }

  _startGame () {
    this._isGameOver = false
    this._lastMoveTime = 0
    this._moveDelay = INITIAL_MOVE_DELAY
    this._updateScore(0)

    requestAnimationFrame(this._gameLoop)
  }

  _gameLoop = (timestamp) => {
    if (!this._isGameOver) {
      if (timestamp - this._lastMoveTime >= this._moveDelay) {
        this._lastMoveTime = timestamp
        this._moveSnake(this._snake)
      }
    }

    this._updateAndRenderBoard()
    requestAnimationFrame(this._gameLoop)
  }

  _updateAndRenderBoard = () => {
    this._board.clearBoard()
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
  }

  _moveSnake (snake) {
    const head = snake.getNextHead()

    if (this._isCollisionWithWall(head) || this._isCollisionWithSelf(head)) {
      this._gameOver()
      return
    }

    if (this._isCollisionWithApple(head)) {
      snake.grow()
      snake.move()
      this._updateScore(this._score + 1)
      this._apple.spawn(snake, this._board.width, this._board.height)
      this._moveDelay -= MOVE_DELAY_DECREMENT
    } else {
      snake.move()
    }

    this._updateAndRenderBoard()
  }

  _isCollisionWithWall (position) {
    return (
      position.x < 0 ||
      position.x >= this._board.width ||
      position.y < 0 ||
      position.y >= this._board.height
    )
  }

  _isCollisionWithSelf (position) {
    for (let i = 1; i < this._snake.body.length; i++) {
      if (
        position.x === this._snake.body[i].x &&
        position.y === this._snake.body[i].y
      ) {
        return true
      }
    }
    return false
  }

  _isCollisionWithApple (position) {
    return position.x === this._apple.x && position.y === this._apple.y
  }

  _gameOver () {
    this._isGameOver = true
  }

  _restartGame () {
    this._snake = new Snake()
    this._apple = new Apple(this._snake, this._board.width, this._board.height)
    this._board.clearBoard()
    this._startGame()
  }
}
