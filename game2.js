

kaboom({
	global: true,
	canvas: document.getElementById("pupet"),
	debug: true,
	background: [79, 155, 255],
	maxFps: 120,
	scale: 2
	
})




onLoading((progress) => {
	loadShader("crt", null, `
	uniform float u_time;
	uniform float u_flatness;
	uniform float u_scanline_height;
	uniform float u_screen_height;
	uniform float u_startTime;
	uniform float u_duration;
	uniform sampler2D tex1; // Первая текстура
	uniform sampler2D tex2; // Вторая текстура
	vec2 mirroredRepeat(vec2 uv) {
		vec2 mirroredUV = mod(uv, 2.0); // Получаем остаток от деления на 2
		mirroredUV = mix(mirroredUV, 2.0 - mirroredUV, step(1.0, mirroredUV)); // Зеркальное отражение за пределами [0, 1]
		return mirroredUV;
	}
	vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
		float effectProgress = 0.5 * clamp((u_time - u_startTime) / u_duration, 0.0, 1.0);
		float flipInterval = 3.0; // Период для переворота
		float flipState = mod(u_time, flipInterval * 2.0) > flipInterval ? 1.0 : 0.0; // Переворачиваем каждые 3 секунды
	
		// Инвертируем UV координаты, если flipState == 1.0
		uv.y = mix(uv.y, 1.0 - uv.y, flipState);
	
		// Далее следуют остальные трансформации UV и применение эффектов
		float waveAmplitude1 = 0.05 * effectProgress;
		float waveFrequency1 = 10.0;
		float wave1 = waveAmplitude1 * sin(uv.y * waveFrequency1 + u_time * 1.3);
		vec2 waveUv1 = uv + vec2(wave1, 0.0);
	
		float waveAmplitude2 = 0.05 * effectProgress;
		float waveFrequency2 = 10.0;
		float wave2 = waveAmplitude2 * sin(uv.y * waveFrequency2 - u_time * 1.3);
		vec2 waveUv2 = uv + vec2(wave2, 0.0);
	
		vec2 center = vec2(0.5, 0.5);
		vec2 off_center1 = waveUv1 - center;
		off_center1 *= 1.0 + pow(abs(off_center1.yx), vec2(u_flatness));
		vec2 uv1 = center + off_center1;
		vec4 color1 = texture2D(tex1, mirroredRepeat(uv1)).rgba;
	
		vec2 off_center2 = waveUv2 - center;
		off_center2 *= 1.0 + pow(abs(off_center2.yx), vec2(u_flatness));
		vec2 uv2 = center + off_center2;
		vec4 color2 = texture2D(tex2, mirroredRepeat(uv2)).rgba;
	
		vec4 finalColor = mix(color1, color2, effectProgress);
	
		return finalColor;
	}

	

	
`)
loadShader('def', null, `
uniform float u_time;
uniform sampler2D tex;

vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
    // Параметры эффекта волны
    float waveAmplitude = 0.02; // Амплитуда волны
    float waveFrequency = 6.0; // Частота волны
    float waveSpeed = 3.0; // Скорость волны

    // Применяем вертикальный и горизонтальный эффект волны к UV
    uv.x += waveAmplitude * sin(uv.y * waveFrequency + u_time * waveSpeed);
    uv.y += waveAmplitude * cos(uv.x * waveFrequency + u_time * waveSpeed);

    // Используем измененные UV для выборки из текстуры
    vec4 c = texture2D(tex, uv);

    return c;
}
`)
	// Black background
	loadRoot('https://i.imgur.com/')
	loadSprite('mario', 'SOTakZo.png', {
		
		 
        sliceX: 10,
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

			},
			jump: {
				from: 2,
				to: 4,
				
				speed: 1.8,
			},
			smoke: {
				from: 5,
				to: 9,
				speed: 2,
				
			}
			
        }
    })
loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'KPO3fR9.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'uzvFujU.png')
loadSprite('cloud', 'JknDXMj.png',
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
loadSprite('mushroom', '0wMd92p.png')
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
loadSprite('textcab', 'yiHU8S4.png')


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
const FALL_DEATH = height()* 0.9
console.log(FALL_DEATH + " FD")
let isMoving = false;
let smokingDob = false;
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
			smokingDob=false
			usePostEffect(null)
		},
		biggify(timing) {
			destScale = 1
			timer = timing
			isBig = true
			smokingDob = true
	
		setTimeout(() => {
			
			smokingDob = false
		}
		
		, 3500);
		},
	}
}

// define some constants


const LEVELS = [

	[
"                =         ==                                                                                                                                                                  ",
"                ==                                                                                                                                                                  ",
"                =                                                                                                                                                                   ",
"            =   =                                                                                                                                                                   ",
"            =   =                               =                                                                                                                                   ",
"            =   =              =       =        =                                                                                                                                   ",
"            =   =              =       =        =                                                                                                                                   ",
"       #    =   =      #       =   >   =   >    =                                                                                                                                   ",
"====================================================================================================================================================================================",
"===================================================================================================================================================================================="
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
			area({ collisionIgnore: ['platform'] }),
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

			area({ collisionIgnore: ['coin'] }),
			body({ isStatic: true }),
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
			patrol(300),
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
		pos(30, (height()*0.5)),
		console.log(height() + " height all"),
		
		area({ shape: new Rect(vec2(0), 42, 42) }),
	
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
		if (currCam.x > player.pos.x && player.pos.x > width()* 0.5	) {
			camPos(player.pos.x, currCam.y);
		  }
		// check fall death
		if (player.pos.y >= FALL_DEATH) {
			go("lose")
		}

		if(!isMoving ){
			if(player.isGrounded()){
				
				player.stop("idle1")
				player.play("idle")
			}
			
			
		}
		if(player.isGrounded()){
		if(!smokingDob)	{
		if(isKeyPressed("right") || isKeyPressed("left") || isKeyPressed("a") || isKeyPressed("d"))
		{
			console.log("right")


		player.play("idle1")
		}

		}
	
		}
		if(isKeyPressed("space") && !smokingDob){
			player.play("jump")
		}
	})

	player.onBeforePhysicsResolve((collision) => {
		if (collision.target.is(["platform", "soft"]) && player.isJumping()) {
			collision.preventResolution()
		}
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
			
		}
		if(!smokingDob){
		player.play("idle1")
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
		
		
		player.area.shape =  new Rect(vec2(0), 42, 31) 
		player.play("smoke")
		setTimeout(() => {
			player.area.shape =  new Rect(vec2(0), 42, 42) 
			player.play("idle")



		}, 3500)
	
	})

	player.onGround((i) => {
		if (i.is("mushroom")) {
			isMoving = true
			// as we defined in the big() component
			player.biggify(15)
			hasApple = false
			
			player.play("smoke")
			setTimeout(() => {
	
				player.play("idle")
	
	
	
			}, 3500)
			
		}
	
        
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
		if (player.isGrounded() && !smokingDob) {
			
            if(isBig){
            	player.jump(JUMP_FORCE*1.3)
               
            }else{

                player.jump(JUMP_FORCE)
            }
		
		}
	
	}

	let arrowKeyDown = false;
	let symbolKeyDown = false;


	// jump with space
	onKeyPress("space", 
	jump)
	onKeyPress("e", () => {
		player.play("jump")
		player.biggify(15)
		hasApple = false
	})
	onKeyDown("left", () => {
		if(!symbolKeyDown && !smokingDob){
		player.flipX = true
		if (toScreen(player.pos).x > 20) {
			player.move(-MOVE_SPEED, 0);
		  }
		  isMoving = true;
		}
		
	})
	
	onKeyDown("right", () => {
		if(!symbolKeyDown && !smokingDob){
			player.flipX = false
			player.move(MOVE_SPEED, 0)
			isMoving = true;
		}
		
		
	})

	onKeyPress("left", () => {
		
			

		arrowKeyDown = true;
		
	})
	onKeyPress("right", () => {
		
	
		arrowKeyDown = true;
	
	})
	
	onKeyRelease("left", () => {
		if(!smokingDob){
			isMoving = false;
		}
	
		arrowKeyDown = false;

	})

	onKeyRelease("right", () => {
		if(!smokingDob){
			isMoving = false;
		}
		arrowKeyDown = false;
	})
	


	onKeyDown("a", () => {
		if(!arrowKeyDown || !smokingDob){
		player.flipX = true
		if (toScreen(player.pos).x > 20) {
			player.move(-MOVE_SPEED, 0);
		  }
		  isMoving = true;
		}
	})

	onKeyDown("d", () => {
		if(!arrowKeyDown || !smokingDob){
		player.flipX = false
		player.move(MOVE_SPEED, 0)
		isMoving = true;
		}
	})



	onKeyPress("a", () => {
		
		
		symbolKeyDown = true;
	})

	onKeyPress("d", () => {
		symbolKeyDown = true;
		
	})
	
	

	onKeyRelease("a", () => {
		if(!smokingDob){
			isMoving = false;
		}
		symbolKeyDown = false;
	})

	onKeyRelease("d", () => {
		if(!smokingDob){
			isMoving = false;
		}
		symbolKeyDown = false;
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
	smallify()
	go("game", {
		levelId: 0,
		coins: 0,
	})
} 

go("startScene")
