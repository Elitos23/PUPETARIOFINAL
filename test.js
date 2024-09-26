

kaboom({
	global: true,
	canvas: document.getElementById("pupet"),
	debug: true,
	background: [79, 155, 255],
	maxFps: 120,
	scale: 2
	
})

let loadShader = false;
const effects = {
	crt: () => ({
		"u_flatness": 3,
	})}

for (const effect in effects) {
	loadShaderURL(effect, null, `http://192.168.126.1:8080/crt.frag`)
	loadShader = true;
}

onLoading((progress) => {

	
	
	// Black background

	loadSprite('mario', 'https://i.imgur.com/o2kWmE0.png', {
		
		animSpeed: 0.1, 
        sliceX: 2,
        anims: {
            idle1: {
                from: 1,
                to: 0,
                loop: true,
				speed: 4,
				
            },
			idle: {
				from: 0,
				to: 0

			}
			
        }
    })
loadSprite('coin', 'https://i.imgur.com/wbKxhcd.png')
loadSprite('evil-shroom', 'https://i.imgur.com/KPO3fR9.png')
loadSprite('brick', 'https://i.imgur.com/pogC9x5.png')
loadSprite('block', 'https://i.imgur.com/uzvFujU.png')
loadSprite('cloud', 'https://i.imgur.com/JknDXMj.png',
{
		
	animSpeed: 0.1, 
	sliceX: 3,
	anims: {
		 idle: {
		from: 0,
		to: 2,
		loop: true,
		speed: 4,
	}
	}
})
loadSprite('mushroom', 'https://i.imgur.com/0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-right', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-right', 'nqQ79eI.png')
loadSprite('spike', 'esrhU1m.png')
loadSprite('blue-block', 'fVscIbn.png')

loadSprite('blue-brick', '68Tjj61.png')
loadSprite('blue-steel', 'UwvKOmq.png')
loadSprite('blue-evil-shroom', 'SvV4ueD.png')
loadSprite('portal', 'RMqCc1G.png')
loadSprite('textcab', 'https://i.imgur.com/yiHU8S4.png')




})


// custom component controlling enemy patrol movement
function patrol(speed = 200, dir = 1) {
	return {
		id: "patrol",
		require: [ "pos", "area" ],
		add() {
			this.on("collide", (obj, col) => {
				if (col.isLeft() || col.isRight()) {
					dir = -dir
				}
			})
		},
		update() {
			this.move(speed * dir, 0)
		},
	}
}

const JUMP_FORCE = 650
const MOVE_SPEED = 210
const FALL_DEATH = 300
let isMoving = false;
let isBig = false
let CURRENT_JUMP_FORCE = JUMP_FORCE
// custom component that makes stuff grow big
function big() {
	let timer = 0
	
	let destScale = 1
	return {
		// component id / name
		id: "big",
		// it requires the scale component
		require: [ "scale" ],
		// this runs every frame
		update() {
			if (isBig) {
				timer -= dt()
				if (timer <= 0) {
					this.smallify()
				}
			}
			this.scale = this.scale.lerp(vec2(destScale), dt() * 6)
		},
		// custom methods
		isBig() {
			return isBig
		},
		smallify() {
			destScale = 1
			timer = 0
			isBig = false
		},
		biggify(time) {
			destScale = 2
			timer = time
			isBig = true
		},
	}
}

// define some constants


const LEVELS = [

	[
		"                                                                                               ",
		"                                                                                               ",
		"                                                                                               ",
		"                                                                                               ",
		"                                                                                               ",
		"                                                                                               ",
		"               =              =                                                                 ",
		"               =           >  =                                                                  ",
		"========    ==================================================================================",
		"========    ==================================================================================",
	  ]
]

// define what each symbol means in the level graph
const levelConf = {
		// The size of each grid
		tileWidth: 20,
		tileHeight: 20,
		pos: vec2(0, height()-180),
    
	tiles: {
		"=": () => [
			sprite("block"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			
		
			"platform",
		],
		"-": () => [
			sprite("blue-block"),
			area(),
			body({ isStatic: true }),
			offscreen({ hide: true }),
			anchor("bot"),
		],
		"c":() =>[
			sprite("cloud", { anim: "idle" }),
		
			area(),
			offscreen({ hide: true }),
			body({ isStatic: true }),
			
			anchor("bot"),
		],  
        "p": () => [
			sprite("blue-brick"),
			area(),
			offscreen({ hide: true }),
			body({ isStatic: true }),
			
			anchor("bot"),
		],

		"$": () => [
			sprite("coin"),

			area(),
			pos(0, -9),
			anchor("bot"),
			offscreen({ hide: true }),
			"coin",
		],
        ":": () => [
			sprite("blue-steel"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			
		],
        
		"%": () => [
			sprite("surprise"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
		
			"prize",
		],
		"^": () => [
			sprite("spike"),
			area(),
			body({ isStatic: true }),
			anchor("bot"),
			offscreen({ hide: true }),
			"danger",
		],
		"#": () => [
			sprite("mushroom"),
            area(),
			anchor("bot"),
			body({ isStatic: true }),
			offscreen({ hide: true }),
			"mushroom",
		],
		">": () => [
			sprite("evil-shroom"),
            area(),
			anchor("bot"),
			body(),
			patrol(),
			offscreen({ hide: true }),
			"enemy",
		],
		"@": () => [
			sprite("portal"),
			area({ scale: 0.5 }),
			anchor("bot"),
			pos(0, -12),
			offscreen({ hide: true }),
			"portal",
		],
	},
}

scene("startScene", () => {
	let {x,y} = center()
	console.log(x)
	add([
		text("SUPER PUPPET BROS", { align: "center", size: (width() + height())/20, }),
		pos(x,y-20),
		anchor("center")
	])
    add([
		text("Press any button to start", { align: "center", size: (width() + height())/50, }),
		pos(x,y+20),
		anchor("center")
    ])
 
	// Press any key to go back
	onKeyPress(start)

})
scene("game", ({ levelId, coins } = { levelId: 0, coins: 0 }) => {

	// add level to scene
	const level = addLevel(LEVELS[levelId ?? 0], levelConf)
    setGravity(2000)

	// define player object
	const player = add([
		sprite("mario"),
		pos(30, (height()-280)),
		area(),
	
		scale(),
        
		// makes it fall to gravity and jumpable
		body(),
        
		// the custom component we defined above
		big(),
		anchor("center"),
	])
	
	// action() runs every frame
	player.onUpdate(() => {
		// center camera to player
	
		var currCam = camPos();
		if (currCam.x < player.pos.x) {
		  camPos(player.pos.x, currCam.y);
		}
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose")
		}

		if(!isMoving){
			player.stop("idle1")
			player.play("idle")
		}
		
	

	})

	player.onBeforePhysicsResolve((collision) => {
		if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
			collision.preventResolution()
		}
	})
	

	player.onPhysicsResolve(() => {
		// Set the viewport center to player.pos
		const plat = level.get("platform")[0]
		// camPos(player.pos.x );
		
		console.log( )
		var currCam = camPos();
		

	})

	// if player onCollide with any obj with "danger" tag, lose
	player.onCollide("danger", () => {
		go("lose")
		
	})

	player.onCollide("portal", () => {
		
		if (levelId + 1 < LEVELS.length) {
			go("game", {
				levelId: levelId + 1,
				coins: coins,
			})
		} else {
			go("win")
		}
	})

	

    
	function addCustomBoom(pos, opt) {
		const explosion = addKaboom(pos, opt);
		
		// Childrens
		const boom = explosion.children[0]
		const ka = explosion.children[1]
	
		// Customize childrens
		boom.color = RED;
		ka.use(sprite("textcab"));
		console.log("boomed")
	}
	


	player.onGround((l) => {
		if (l.is("enemy")) {
			player.jump(JUMP_FORCE * 1.5)
			destroy(l)
			const pos = player.pos;
			addCustomBoom(pos, {scale: 0.5 })
			const effect = Object.keys(effects)[0]
			usePostEffect(effect, effects[effect]())
		}
        
	})

	player.onCollide("enemy", (e, col) => {
		// if it's not from the top, die
		if (!col.isBottom()) {
			go("lose")
			
		}
	})

	let hasApple = false

	// grow an apple if player's head bumps into an obj with "prize" tag
	player.onHeadbutt((obj) => {
		if (obj.is("prize") && !hasApple) {
			const apple = level.spawn("#", obj.tilePos.sub(0, 1))
			apple.jump()
			hasApple = true
			
		}
	})

	// player grows big onCollide with an "apple" obj
	player.onCollide("mushroom", (a) => {
		destroy(a)
		// as we defined in the big() component
		player.biggify(15)
		hasApple = false
	
	})


	

	player.onCollide("coin", (c) => {
		destroy(c)
	
	
		coins += 1
		coinsLabel.text = coins
	})

	const coinsLabel = add([
		text(coins),
		pos(24, 24),
		fixed(),
	])

	function jump() {
		// these 2 functions are provided by body() component
		if (player.isGrounded()) {
			player.play("idle1")
            if(isBig){
            	player.jump(JUMP_FORCE*1.5)
               
            }else{

                player.jump(JUMP_FORCE)
            }
		
		}
	
	}

	let arrowKeyDown = false;
	let symbolKeyDown = false;
	

	// jump with space
	onKeyPress("space", jump)
	onKeyPress("e", () => {
		player.biggify(15)
		hasApple = false
	})
	onKeyDown("left", () => {
		if(!symbolKeyDown){
		player.flipX = true
		if (toScreen(player.pos).x > 20) {
			player.move(-MOVE_SPEED, 0);
		  }
		}
	})
	
	onKeyDown("right", () => {
		if(!symbolKeyDown){
			player.flipX = false
			player.move(MOVE_SPEED, 0)
		}
		
		
	})

	onKeyPress("right", () => {
		
		player.play("idle1")
		isMoving = true;
		arrowKeyDown = true;
		
	})
	onKeyPress("left", () => {
		
		
		player.play("idle1")
		isMoving = true;
	})
	
	onKeyRelease("left", () => {
		isMoving = false;
	})

	onKeyRelease("right", () => {
		isMoving = false;
		arrowKeyDown = false;
	})
	


	onKeyDown("a", () => {
		if(!arrowKeyDown){
		player.flipX = true
		if (toScreen(player.pos).x > 20) {
			player.move(-MOVE_SPEED, 0);
		  }
		}
	})

	onKeyDown("d", () => {
		if(!arrowKeyDown){
		player.flipX = false
		player.move(MOVE_SPEED, 0)
		}
	})

	onKeyPress("d", () => {
		
		player.play("idle1")
		isMoving = true;
		symbolKeyDown = true;
	})
	onKeyPress("a", () => {
		
		
		player.play("idle1")
		isMoving = true;
		symbolKeyDown = true;
	})
	

	onKeyRelease("a", () => {
		isMoving = false;
		symbolKeyDown = false;
	})

	onKeyRelease("d", () => {
		isMoving = false;
		symbolKeyDown = false;
	})


	onGamepadButtonPress("south", jump)

	onGamepadStick("left", (v) => {
		player.move(v.x * MOVE_SPEED, 0)
	})

	onKeyPress("f", () => {
		setFullscreen(!isFullscreen())
	})
    onKeyPress("r", () => {

       go("game")
    })
})

scene("lose", () => {
	let {x,y} = center()
	add([
		text("Game Over", { align: "center", size: (width() + height())/15, }),
		pos(x,y),
		anchor("center")
	])
	add([
		text("Press any button to restart", { align: "center", size: (width() + height())/50, }),
		pos(x,y+40),
		anchor("center")
    ])
	onKeyPress(() => go("game"))
})

scene("win", () => {
	add([
		text("You Win"),
	])
	onKeyPress(() => go("game"))
})
function start() {
	// Start with the "game" scene, with initial parameters
	go("game", {
		levelId: 0,
		coins: 0,
	})
} 

go("startScene")
