// CONFIGURATION
const PIXEL_SIZE = 20
const GAME_SPEED = 100

// DECLARATION
class Coordinate {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class GameMap {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.pixelSize = PIXEL_SIZE
        this.constraintX = this.width / PIXEL_SIZE
        this.constraintY = this.height / PIXEL_SIZE
    }
    randomX() {
        return Math.round(Math.random() * this.width / this.pixelSize)
    }
    randomY() {
        return Math.round(Math.random() * this.height / this.pixelSize)
    }
    getCoordinate(x, y) {
        return new Coordinate(
            (x + this.constraintX) % this.constraintX,
            (y + this.constraintY) % this.constraintY
        )
    }
}

class Snake {
    constructor(gameMap) {
        this.directionX = 1
        this.directionY = 0
        this.gameMap = gameMap
        const randomX = gameMap.randomX()
        const randomY = gameMap.randomY()
        this.coordinates = [
            this.gameMap.getCoordinate(randomX, randomY),
            this.gameMap.getCoordinate(randomX, randomY + 1),
            this.gameMap.getCoordinate(randomX, randomY + 2)
        ]
    }

    setDirection(directionX, directionY) {
        if (this.directionX === -directionX || this.directionY === -directionY) {
            return
        }
        this.directionX = directionX
        this.directionY = directionY
    }
    eat() {
        const lastElement = this.coordinates[this.coordinates.length - 1]
        const newHead = this.gameMap.getCoordinate(
            lastElement.x + this.directionX,
            lastElement.y + this.directionY
        )
        this.coordinates.push(newHead)
    }
    move() {
        const lastElement = this.coordinates[this.coordinates.length - 1]
        const newHead = this.gameMap.getCoordinate(
            lastElement.x + this.directionX,
            lastElement.y + this.directionY
        )
        this.coordinates.shift()
        this.coordinates.push(newHead)
    }
}

class Pray {
    constructor(gameMap) {
        this.exist = true
        this.gameMap = gameMap
        this.coordinate = this.gameMap.getCoordinate(
            gameMap.randomX(),
            gameMap.randomY()
        )
    }
    regenerate() {
        this.coordinate = this.gameMap.getCoordinate(
            this.gameMap.randomX(),
            this.gameMap.randomY()
        )
    }
}

// MAIN PROGRAM
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const gameMap = new GameMap(canvas.width, canvas.height)
const snake = new Snake(gameMap)
const pray = new Pray(gameMap)

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            return snake.setDirection(-1, 0)
        case 'ArrowRight':
            return snake.setDirection(1, 0)
        case 'ArrowUp':
            return snake.setDirection(0, -1)
        case 'ArrowDown':
            return snake.setDirection(0, 1)
        default:
            return
    }
});

setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    snake.coordinates.forEach((coordinate) => {
        const x = coordinate.x * PIXEL_SIZE
        const y = coordinate.y * PIXEL_SIZE
        const width = PIXEL_SIZE
        const height = PIXEL_SIZE
        ctx.fillStyle = "green";
        ctx.strokeStyle = "white"
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height)
    })
    const x = pray.coordinate.x * PIXEL_SIZE
    const y = pray.coordinate.y * PIXEL_SIZE
    const width = PIXEL_SIZE
    const height = PIXEL_SIZE
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, width, height);
    const snakeHead = snake.coordinates[snake.coordinates.length - 1]
    if (snakeHead.x === pray.coordinate.x && snakeHead.y === pray.coordinate.y) {
        snake.eat()
        pray.regenerate()
    } else {
        snake.move()
    }
}, GAME_SPEED)