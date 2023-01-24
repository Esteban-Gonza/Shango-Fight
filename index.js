//Set canvas controllers
const canvas = document.querySelector('canvas')
const canvasContext = canvas.getContext('2d')

//Set canvas size
canvas.width = 1024
canvas.height = 576

//Fill color of BackGround
canvasContext.fillRect(0, 0, canvas.width, canvas.height)

//Gravity variable. Help players get to the ground
const gravity = 0.7

const BackGround = new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './img/Background.png'
})

const Shop = new Sprite({
    position:{
        x:640,
        y:205
    },
    imageSrc: './img/Shop.png',
    scale: 2.3,
    framesMax: 6,
})

//Player instance
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity:{
        x: 0,
        y: 6
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc: './Player/Idle.png',
    framesMax: 8,
    scale:2,
    offset: {
        x: 100,
        y: 95
    },
    sprites:{
        idle:{
            imageSrc: './Player/Idle.png',
            framesMax: 8
        },
        run:{
            imageSrc: './Player/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './Player/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './Player/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './Player/Attack1.png',
            framesMax: 6
        },
        takeHit:{
            imageSrc: './Player/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death:{
            imageSrc: './Player/Death.png',
            framesMax: 6
        }
    },
    attackBox:{
        offset:{
            x:120,
            y:40
        },
        width:145,
        height:50
    },
    characterBox:{
        offset:{
            x:70,
            y:50
        },
        width:50,
        height:100
    }
})

//Enemy instance
const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity:{
        x: 0,
        y: 6
    },
    color: 'blue',
    offset:{
        x: 0,
        y: 0
    },
    imageSrc: './Enemy/Idle.png',
    framesMax: 4,
    scale:2,
    offset: {
        x: 100,
        y: 105
    },
    sprites:{
        idle:{
            imageSrc: './Enemy/Idle.png',
            framesMax: 4
        },
        run:{
            imageSrc: './Enemy/Run.png',
            framesMax: 8
        },
        jump:{
            imageSrc: './Enemy/Jump.png',
            framesMax: 2
        },
        fall:{
            imageSrc: './Enemy/Fall.png',
            framesMax: 2
        },
        attack1:{
            imageSrc: './Enemy/Attack1.png',
            framesMax: 4
        },
        takeHit:{
            imageSrc: './Enemy/Take hit.png',
            framesMax: 3
        },
        death:{
            imageSrc: './Enemy/Death.png',
            framesMax: 7
        }
    },
    attackBox:{
        offset:{
            x:-65,
            y:40
        },
        width:145,
        height:50
    },
    characterBox:{
        offset:{
            x:70,
            y:50
        },
        width:50,
        height:100
    }
})

const keys = {

    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft:{
        pressed: false
    }
}

DecreaseTimer()

//Animation loop. Repeated every frame
function animate(){
    window.requestAnimationFrame(animate)
    canvasContext.fillStyle = 'black'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    BackGround.update()
    Shop.update()
    canvasContext.fillStyle = 'rgba(255, 255, 255, 0.15)'
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //Player movement
    player.velocity.x = 0
    
    if(keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5
        player.switchSprites('run')
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprites('run')
    }else{
        player.switchSprites('idle')
    }

    //player Jump
    if(player.velocity.y < 0){
        player.switchSprites('jump')
    }else if(player.velocity > 0){{
        player.switchSprites('fall')
    }}

    //Enemy movement
    enemy.velocity.x = 0
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5
        enemy.switchSprites('run')
    }else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprites('run')
    }else{
        enemy.switchSprites('idle')
    }

    //Enemy Jump
    if(enemy.velocity.y < 0){
        enemy.switchSprites('jump')
    }else if(enemy.velocity > 0){{
        enemy.switchSprites('fall')
    }}

    //Detect player collision with enemy
    if(RectangularCollision({rectangle1: player, rectangle2: enemy}) && 
    player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false
        enemy.health -= 20
        if(enemy.health <= 0){
            enemy.switchSprites('death')
        }else{
            enemy.switchSprites('takeHit')
        }
        gsap.to('#enemyHealth', {
            width: enemy.health +'%'
        })
    }

    //if player misses
    if(player.isAttacking && player.frameCurrent === 4){

        player.isAttacking = false
    }

    //Detect enemy collision with player
    if(RectangularCollision({rectangle1: enemy, rectangle2: player}) && 
    enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false
        player.health -= 20
        if(player.health <= 0){
            player.switchSprites('death')
        }else{
            player.switchSprites('takeHit')
        }
        gsap.to('#playerHealth', {
            width: player.health +'%'
        })
    }
    
    //if player misses
    if(enemy.isAttacking && enemy.frameCurrent === 2){

        enemy.isAttacking = false
    }

    //End game based on healt
    if(enemy.health <= 0 || player.health <= 0){
        DetermineWinner({player, enemy, timerID})
    }
}

animate()

window.addEventListener('keydown', (event) =>{
    if(player.dead === false && enemy.dead === false){
        switch(event.key){
            //Player Input
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
            break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
            break
            case 'w':
                player.velocity.y = -16
            break
            case ' ':
                player.Attakc()
            break
    
            //Enemy Input
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
            break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
            break
            case 'ArrowUp':
                enemy.velocity.y = -16
            break
            case 'l':
                enemy.Attakc()
            break
        }
    }
})

window.addEventListener('keyup', (event) =>{
    if(player.dead === false && enemy.dead === false){
        switch(event.key){
            //Player Input
            case 'd':
                keys.d.pressed = false
            break
            case 'a':
                keys.a.pressed = false
            break
    
            //Enemy Input
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
            break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
            break
        }
    }
})