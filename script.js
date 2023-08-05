class Cell {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Board {
  constructor () {
    this._cells = []
    this.createBoard()
  }

  createBoard () {
    const boardElement = document.getElementById('board')
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = new Cell(col, row)
        this._cells.push(cell)
        const cellElement = document.createElement('div')
        cellElement.classList.add('cell')
        cellElement.id = `cell-${col}-${row}`
        boardElement.appendChild(cellElement)
      }
    }
  }

  renderSnake (snake) {
    this.clearBoard()
    snake.body.forEach((segment) => {
      const cellElement = document.getElementById(`cell-${segment.x}-${segment.y}`)
      if (cellElement) {
        cellElement.classList.add('snake')
      }
    })
  }

  renderApple (apple) {
    const cellElement = document.getElementById(`cell-${apple.x}-${apple.y}`)
    cellElement.classList.add('apple')
  }

  clearBoard () {
    this._cells.forEach((cell) => {
      const cellElement = document.getElementById(`cell-${cell.x}-${cell.y}`)
      cellElement.className = 'cell'
    })
  }
}

class Snake {
  constructor () {
    this.body = [new Cell(5, 5), new Cell(4, 5)]
    this.direction = 'right'
  }

  move () {
    const head = this.getNextHead()
    this.body.unshift(head)
    this.body.pop()
  }

  getNextHead () {
    const head = this.body[0]
    let newHeadX = head.x
    let newHeadY = head.y

    if (this.direction === 'up') {
      newHeadY = (head.y - 1 + 10) % 10
    } else if (this.direction === 'down') {
      newHeadY = (head.y + 1) % 10
    } else if (this.direction === 'left') {
      newHeadX = (head.x - 1 + 10) % 10
    } else if (this.direction === 'right') {
      newHeadX = (head.x + 1) % 10
    }

    return new Cell(newHeadX, newHeadY)
  }

  grow () {
    const tail = this.body[this.body.length - 1]
    const newTail = new Cell(tail.x, tail.y)
    this.body.push(newTail)
  }
}

class Apple {
  constructor (snake) {
    this.spawn(snake)
  }

  spawn (snake) {
    this.x = Math.floor(Math.random() * 10)
    this.y = Math.floor(Math.random() * 10)

    snake.body.forEach(cell => {
      if (this.x === cell.x && this.y === cell.y) {
        this.spawn(snake)
      }
    })
  }
}

class Game {
  constructor (board, snake, apple) {
    this._board = board
    this._snake = snake
    this._apple = apple
    this._score = 0
    this._bestScore = localStorage.getItem('bestScore') || 0
    this._interval = null
    this._isGameOver = false
  }

  init () {
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
    this._displayBestScore()
    this._addControls()
  }

  _addControls () {
    document.addEventListener('keydown', (event) => {
      const key = event.key
      if (key === 'ArrowUp' && this._snake.direction !== 'down') {
        this._snake.direction = 'up'
      } else if (key === 'ArrowDown' && this._snake.direction !== 'up') {
        this._snake.direction = 'down'
      } else if (key === 'ArrowLeft' && this._snake.direction !== 'right') {
        this._snake.direction = 'left'
      } else if (key === 'ArrowRight' && this._snake.direction !== 'left') {
        this._snake.direction = 'right'
      }
    })

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', () => {
      this._restartGame()
    })

    const board = document.getElementById('board')
    board.addEventListener('click', () => {
      this._startGame()
    })
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
    this._moveDelay = 100
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

    this._board.clearBoard()
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)

    requestAnimationFrame(this._gameLoop)
  }

  _moveSnake (snake) {
    const head = snake.getNextHead()

    if (head.x < 0) head.x = 9
    if (head.x > 9) head.x = 0
    if (head.y < 0) head.y = 9
    if (head.y > 9) head.y = 0

    for (let i = 1; i < snake.body.length; i++) {
      if (head.x === snake.body[i].x && head.y === snake.body[i].y) {
        this._gameOver()
        return
      }
    }

    if (head.x === this._apple.x && head.y === this._apple.y) {
      snake.grow()
      this._updateScore(this._score + 1)
      this._apple.spawn(snake)
    } else {
      snake.move()
    }

    this._board.clearBoard()
    this._board.renderSnake(snake)
    this._board.renderApple(this._apple)
  }

  _gameOver () {
    this._isGameOver = true
  }

  _restartGame () {
    this._snake = new Snake()
    this._apple.spawn(this._snake)
    this._board.clearBoard()
    this._startGame()
  }
}

function initGame () {
  const board = new Board()
  const snake = new Snake()
  const apple = new Apple(snake)
  const game = new Game(board, snake, apple)

  game.init()
}

initGame()
