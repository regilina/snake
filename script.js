const INITIAL_MOVE_DELAY = 500
const MOVE_DELAY_DECREMENT = 20
const MIN_BOARD_SIZE = 10
const MAX_BOARD_SIZE = 100

class Cell {
  constructor (x, y) {
    this.x = x
    this.y = y
  }
}

class Board {
  constructor (width, height) {
    this.cells = []
    this.width = width
    this.height = height
    this.createBoard()
  }

  createBoard () {
    const boardElement = document.getElementById('board')
    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
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
      newHeadY = (head.y - 1)
    } else if (this.direction === 'down') {
      newHeadY = (head.y + 1)
    } else if (this.direction === 'left') {
      newHeadX = (head.x - 1)
    } else if (this.direction === 'right') {
      newHeadX = (head.x + 1)
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
  constructor (snake, boardWidth, boardHeight) {
    this.spawn(snake, boardWidth, boardHeight)
  }

  spawn (snake, boardWidth, boardHeight) {
    this.x = Math.floor(Math.random() * boardWidth)
    this.y = Math.floor(Math.random() * boardHeight)

    snake.body.forEach(cell => {
      if (this.x === cell.x && this.y === cell.y) {
        this.spawn(snake, boardWidth, boardHeight)
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
    this._isGameOver = false
  }

  init () {
    this._board.renderSnake(this._snake)
    this._board.renderApple(this._apple)
    this._displayBestScore()
    this._addControls()
  }

  _addControls () {
    const directionMap = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right'
    }

    document.addEventListener('keydown', (event) => {
      const key = event.key
      const newDirection = directionMap[key]

      if (newDirection && newDirection !== this._snake.direction) {
        this._snake.direction = newDirection
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

function initGame () {
  const boardWidth = parseInt(prompt(`Введите ширину поля (от ${MIN_BOARD_SIZE} до ${MAX_BOARD_SIZE}):`))
  const boardHeight = parseInt(prompt(`Введите высоту поля (от ${MIN_BOARD_SIZE} до ${MAX_BOARD_SIZE}):`))

  if (isNaN(boardWidth) || boardWidth < MIN_BOARD_SIZE || boardWidth > MAX_BOARD_SIZE || isNaN(boardHeight) || boardHeight < MIN_BOARD_SIZE || boardHeight > MAX_BOARD_SIZE) {
    alert(`Некорректный размер поля. Пожалуйста, введите число от ${MIN_BOARD_SIZE} до ${MAX_BOARD_SIZE}.`)
    return
  }

  const board = new Board(boardWidth, boardHeight)
  const snake = new Snake()
  const apple = new Apple(snake, boardWidth, boardHeight)
  const game = new Game(board, snake, apple)

  document.documentElement.style.setProperty('--cols', boardWidth)
  document.documentElement.style.setProperty('--rows', boardHeight)

  game.init()
}

initGame()
