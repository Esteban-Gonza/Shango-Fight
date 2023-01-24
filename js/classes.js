//Sprite class. Use constructor to create 'player' playable objects
class Sprite{
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x:0, y:0}
    }){
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
        this.offset = offset
    }

    //Instance red rectangles as players
    Draw(){
        canvasContext.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)
    }

    animateFrames(){
        this.frameElapsed++

        if(this.frameElapsed % this.frameHold === 0){
            if(this.frameCurrent < this.framesMax - 1){
                this.frameCurrent++
            }else{
                this.frameCurrent = 0
            }
        }
    }

    //Called on Animate function
    update(){
        this.Draw()
        this.animateFrames()       
    }
}

class Fighter extends Sprite{
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {x:0, y:0},
        sprites,
        attackBox = {offset:{}, width: undefined, height: undefined},
        characterBox = {offset:{}, width: undefined, height: undefined}
    }){
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.characterBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: characterBox.offset,
            width: characterBox.width,
            height: characterBox.height
        }
        this.color = color
        this.isAttacking = false
        this.health = 100
        this.frameCurrent = 0
        this.frameElapsed = 0
        this.frameHold = 5
        this.sprites = sprites
        this.dead = false

        for(const sprite in this.sprites){
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
        console.log(this.sprites);
    }

    //Repeated every frame. Called on Animate function
    update(){
        this.Draw()
        if(this.dead === false){
            this.animateFrames()
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.characterBox.position.x = this.position.x + this.characterBox.offset.x
        this.characterBox.position.y = this.position.y + this.characterBox.offset.y
        
        /*canvasContext.fillRect(
            this.attackBox.position.x, 
            this.attackBox.position.y, 
            this.attackBox.width, 
            this.attackBox.height
        )

        canvasContext.fillRect(
            this.characterBox.position.x, 
            this.characterBox.position.y, 
            this.characterBox.width, 
            this.characterBox.height
        )*/
        
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //Get players to the ground and stop when reach bottom
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 75){
            this.velocity.y = 0
            this.position.y = 350
        }else this.velocity.y += gravity
    }

    Attakc(){
        this.switchSprites('attack1')
        this.isAttacking = true
    }

    switchSprites(sprite){
        //Override animations with attack animation
        if(this.image === this.sprites.death.image){
            if(this.frameCurrent === this.sprites.death.framesMax -1){
                this.dead = true
                console.log(this.dead)
            }
            return
        }

        //Override animations with attack animation
        if(this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1) 
            return

        //Override animations with takeHit animation
        if(this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.framesMax - 1) 
            return

        switch(sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image 
                    this.framesMax = this.sprites.run.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.frameCurrent = 0
                }
            break
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.frameCurrent = 0
                }
            break
        }
    }
}