import { Board } from './Board.js'
import { Snake } from './Snake.js'
import { Apple } from './Apple.js'
import { Game } from './Game.js'

const MIN_BOARD_SIZE = 10
const MAX_BOARD_SIZE = 100

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
