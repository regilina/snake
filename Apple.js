export class Apple {
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
