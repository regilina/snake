import { Cell } from './Cell.js'

export class Board {
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
