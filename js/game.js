const fireman_image = new Image()
fireman_image.src = "/img/fireman.png"
const house_image = new Image()
house_image.src = "/img/house.png"
const background_image = new Image()
background_image.src = "/img/background.jpg"

class Game {
    constructor() {
        this.canvas = null
        this.ctx = null
        this.player = null
        this.fireArray = []
        this.waterArray = []
        this.temp = 0
        this.isGameOver = false
    }
    start() {
        this.canvas = document.querySelector("canvas")
        this.ctx = canvas.getContext("2d")
        //CREATE NEW PLAYER
        this.player = new Player(this.canvas)

        //KEY PRESS UP OR DOWN, TO CHANGE ANGLE OF PLAYER
        this.handleKeyDown = (event) => {
            if(event.code === "ArrowUp") return this.player.angle -= 1
            if (event.code === "ArrowDown") return this.player.angle += 1
        }
        window.addEventListener("keydown", this.handleKeyDown);

        this.startLoop()
    }
    startLoop() {
        const loop = () => {
            //CLEAR THE CANVAS
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
            //DRAW BACKGROUND
            this.ctx.drawImage(background_image,0,0,this.canvas.width,this.canvas.height)
            //DRAW THE FIREMAN
            this.ctx.drawImage(fireman_image,80,270,250,220)
            //DRAW THE HOUSE
            this.ctx.drawImage(house_image,430,20,350,450)
            //DRAW THE PLAYER
            this.player.draw()
            
            //CREATE FIRE
            this.generateFire()
            //DRAW FIRE
            this.fireArray.forEach(fire => {
                fire.draw()
                fire.checkCollision()
            })
            //CREATE WATER
            if(Math.random()>0.9) {
                this.waterArray.push(new Water(this.canvas,this.player.angle,this.fireArray, this.waterArray))
            }
            this.waterArray.forEach((water,i) => { 
                water.update()
                water.draw()
                water.checkCollision()
                if (water.checkWalls()) { // Checks to see if water is outside the canvas
                    this.waterArray.splice(i,1)
                }
                console.log("this.waterArray.length: ", this.waterArray.length)
            })
            //CHECK AMOUNT OF FIRE
            this.checkAmountOfFire()
            if (this.isGameOver===false) {
                window.requestAnimationFrame(loop)
            } else {
                buildGameOver()
            }
            
            
        }
        window.requestAnimationFrame(loop)
    }
    generateFire() {      
        if(Math.random()>0.96) {
            let ranX = Math.random()*((this.canvas.width - 80) - 400) + 400 //(max - min) + min
            let ranY = Math.random()*(380 - 20) + 20
            this.fireArray.push(new Fire(this.canvas,ranX,ranY,this.waterArray))
        }
    }
    checkAmountOfFire() {
        if(this.fireArray.length > 30) this.isGameOver = true
    }
}