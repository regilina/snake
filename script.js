class Cell {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Board {
  constructor () {
    this.cells = []
    this.createBoard()
  }

  createBoard () {
    const boardElement = document.getElementById('board')
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = new Cell(col, row)
        this.cells.push(cell)
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
    this.cells.forEach((cell) => {
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
  constructor () {
    this.spawn()
  }

  spawn () {
    this.x = Math.floor(Math.random() * 10)
    this.y = Math.floor(Math.random() * 10)
  }
}

class Game {
  constructor (board, snake, apple) {
    this.board = board
    this.snake = snake
    this.apple = apple
    this.score = 0
    this.bestScore = localStorage.getItem('bestScore') || 0
    this.interval = null
    this.isGameOver = false
    this.init()
  }

  init () {
    this.board.renderSnake(this.snake)
    this.board.renderApple(this.apple)
    this.updateScore(0)
    this.addControls()
    this.startGame()
  }

  addControls () {
    document.addEventListener('keydown', (event) => {
      const key = event.key
      if (key === 'ArrowUp' && this.snake.direction !== 'down') {
        this.snake.direction = 'up'
      } else if (key === 'ArrowDown' && this.snake.direction !== 'up') {
        this.snake.direction = 'down'
      } else if (key === 'ArrowLeft' && this.snake.direction !== 'right') {
        this.snake.direction = 'left'
      } else if (key === 'ArrowRight' && this.snake.direction !== 'left') {
        this.snake.direction = 'right'
      }
    })

    const restartButton = document.getElementById('restart-button')
    restartButton.addEventListener('click', () => {
      this.restartGame()
    })
  }

  updateScore (score) {
    this.score = score
    document.getElementById('score').textContent = this.score
    if (this.score > this.bestScore) {
      this.bestScore = this.score
      document.getElementById('best-score').textContent = this.bestScore;
      localStorage.setItem('bestScore', this.bestScore)
    }
  }

  startGame () {
    this.isGameOver = false
    this.lastMoveTime = 0
    this.moveDelay = 100
    document.getElementById('best-score').textContent = this.bestScore;
    this.board.renderSnake(this.snake)
    this.board.renderApple(this.apple)
    this.updateScore(0)
    this.addControls()

    requestAnimationFrame(this.gameLoop)
  }

  gameLoop = (timestamp) => {
    if (!this.isGameOver) {
      if (timestamp - this.lastMoveTime >= this.moveDelay) {
        this.lastMoveTime = timestamp
        this.moveSnake()
      }
    }

    this.board.clearBoard()
    this.board.renderSnake(this.snake)
    this.board.renderApple(this.apple)

    requestAnimationFrame(this.gameLoop)
  }

  handleKeyDown = (event) => {
    const key = event.key
    if (key === 'ArrowUp' && this.snake.direction !== 'down') {
      this.snake.direction = 'up'
    } else if (key === 'ArrowDown' && this.snake.direction !== 'up') {
      this.snake.direction = 'down'
    } else if (key === 'ArrowLeft' && this.snake.direction !== 'right') {
      this.snake.direction = 'left'
    } else if (key === 'ArrowRight' && this.snake.direction !== 'left') {
      this.snake.direction = 'right'
    }
  }

  moveSnake = () => {
    const head = this.snake.getNextHead()

    if (head.x < 0) head.x = 9
    if (head.x > 9) head.x = 0
    if (head.y < 0) head.y = 9
    if (head.y > 9) head.y = 0

    for (let i = 1; i < this.snake.body.length; i++) {
      if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
        this.gameOver()
        return
      }
    }

    if (head.x === this.apple.x && head.y === this.apple.y) {
      this.snake.grow()
      this.updateScore(this.score + 1)
      this.apple.spawn()
    } else {
      this.snake.move()
    }

    this.board.clearBoard()
    this.board.renderSnake(this.snake)
    this.board.renderApple(this.apple)
  }

  gameOver () {
    this.isGameOver = true
    clearInterval(this.interval)
    const restartButton = document.getElementById('restart-button')
    restartButton.style.display = 'block'
  }

  restartGame () {
    this.snake = new Snake()
    this.apple.spawn()
    this.isGameOver = false
    this.updateScore(0)
    this.board.clearBoard()
    this.board.renderSnake(this.snake)
    this.board.renderApple(this.apple)
    const restartButton = document.getElementById('restart-button')
    restartButton.style.display = 'none'
    this.startGame()
  }
}

function initGame () {
  const board = new Board()
  const snake = new Snake()
  const apple = new Apple()
  const game = new Game(board, snake, apple)

  game.init()
}

initGame()