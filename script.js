class Cell {
  constructor (x, y) {
    this._x = x
    this._y = y
  }

  getX () {
    return this._x
  }

  getY () {
    return this._y
  }

  setX (x) {
    this._x = x
  }

  setY (y) {
    this._y = y
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
    snake.getBody().forEach((segment) => {
      const cellElement = document.getElementById(`cell-${segment.getX()}-${segment.getY()}`)
      if (cellElement) {
        cellElement.classList.add('snake')
      }
    })
  }

  renderApple (apple) {
    const cellElement = document.getElementById(`cell-${apple.getX()}-${apple.getY()}`)
    cellElement.classList.add('apple')
  }

  clearBoard () {
    this._cells.forEach((cell) => {
      const cellElement = document.getElementById(`cell-${cell.getX()}-${cell.getY()}`)
      cellElement.className = 'cell'
    })
  }
}

class Snake {
  constructor () {
    this._body = [new Cell(5, 5), new Cell(4, 5)]
    this._direction = 'right'
  }

  getDirection () {
    return this._direction
  }

  setDirection (direction) {
    this._direction = direction
  }

  getBody () {
    return this._body
  }

  move () {
    const head = this.getNextHead()
    this._body.unshift(head)
    this._body.pop()
  }

  getNextHead () {
    const head = this._body[0]
    let newHeadX = head.getX()
    let newHeadY = head.getY()

    if (this._direction === 'up') {
      newHeadY = (head.getY() - 1 + 10) % 10
    } else if (this._direction === 'down') {
      newHeadY = (head.getY() + 1) % 10
    } else if (this._direction === 'left') {
      newHeadX = (head.getX() - 1 + 10) % 10
    } else if (this._direction === 'right') {
      newHeadX = (head.getX() + 1) % 10
    }

    return new Cell(newHeadX, newHeadY)
  }

  grow () {
    const tail = this._body[this._body.length - 1]
    const newTail = new Cell(tail.getX(), tail.getY())
    this._body.push(newTail)
  }
}

class Apple {
  constructor (snake) {
    this.spawn(snake)
  }

  spawn (snake) {
    this._x = Math.floor(Math.random() * 10)
    this._y = Math.floor(Math.random() * 10)

    snake.getBody().forEach(cell => {
      if (this._x === cell.getX() && this._y === cell.getY()) {
        this.spawn(snake)
      }
    })
  }

  getX () {
    return this._x
  }

  getY () {
    return this._y
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
    this.updateScore(0)
    this.displayBestScore()
    this.addControls()
    this.startGame()
  }

  addControls () {
    document.addEventListener('keydown', (event) => {
      const key = event.key
      if (key === 'ArrowUp' && this._snake.getDirection() !== 'down') {
        this._snake.setDirection('up')
      } else if (key === 'ArrowDown' && this._snake.getDirection() !== 'up') {
        this._snake.setDirection('down')
      } else if (key === 'ArrowLeft' && this._snake.getDirection() !== 'right') {
        this._snake.setDirection('left')
      } else if (key === 'ArrowRight' && this._snake.getDirection() !== 'left') {
        this._snake.setDirection('right')
      }
    })

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', () => {
      this.restartGame()
    })
  }

  updateScore (score) {
    this._score = score
    document.getElementById('score').textContent = this._score
    if (this._score > this._bestScore) {
      this._bestScore = this._score
      this.displayBestScore()
      localStorage.setItem('bestScore', this._bestScore)
    }
  }

  displayBestScore () {
    document.getElementById('best-score').textContent = this._bestScore
  }

  startGame () {
    this._isGameOver = false
    this._lastMoveTime = 0
    this._moveDelay = 100
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
    this.updateScore(0)

    requestAnimationFrame(this.gameLoop)
  }

  gameLoop = (timestamp) => {
    if (!this._isGameOver) {
      if (timestamp - this._lastMoveTime >= this._moveDelay) {
        this._lastMoveTime = timestamp
        this.moveSnake(this._snake)
      }
    }

    this._board.clearBoard()
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)

    requestAnimationFrame(this.gameLoop)
  }

  handleKeyDown = (event) => {
    const key = event.key
    if (key === 'ArrowUp' && this._snake.getDirection() !== 'down') {
      this._snake.setDirection('up')
    } else if (key === 'ArrowDown' && this._snake.getDirection() !== 'up') {
      this._snake.setDirection('down')
    } else if (key === 'ArrowLeft' && this._snake.getDirection() !== 'right') {
      this._snake.setDirection('left')
    } else if (key === 'ArrowRight' && this._snake.getDirection() !== 'left') {
      this._snake.setDirection('right')
    }
  }

  moveSnake (snake) {
    const head = snake.getNextHead()

    if (head.getX() < 0) head.setX(9)
    if (head.getX() > 9) head.setX(0)
    if (head.getY() < 0) head.setY(9)
    if (head.getY() > 9) head.setY(0)

    for (let i = 1; i < snake.getBody().length; i++) {
      if (head.getX() === snake.getBody()[i].getX() && head.getY() === snake.getBody()[i].getY()) {
        this.gameOver()
        return
      }
    }

    if (head.getX() === this._apple.getX() && head.getY() === this._apple.getY()) {
      snake.grow()
      this.updateScore(this._score + 1)
      this._apple.spawn(snake)
    } else {
      snake.move()
    }

    this._board.clearBoard()
    this._board.renderSnake(snake)
    this._board.renderApple(this._apple)
  }

  gameOver () {
    this._isGameOver = true
  }

  restartGame () {
    this._snake = new Snake()
    this._apple.spawn(this._snake)
    this._isGameOver = false
    this.updateScore(0)
    this._board.clearBoard()
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
    this.startGame()
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
