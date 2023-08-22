import { Cell } from './Cell.js'

export class Snake {
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
