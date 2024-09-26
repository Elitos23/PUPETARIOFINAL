onLoading((progress) => {
   
	// Black background
	loadRoot('https://i.imgur.com/')
	loadSprite('mario', 'o2kWmE0.png', {
		
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




	usePostEffect("crt", () => ({
		"u_flatness": 1.5,
		"u_time": time(),
		"u_scanline_height": 1.5,
		"u_screen_height" : 100,
		"u_resolution": vec2(width(), height()),
		"u_startTime" : 0,
		"u_duration" : 5,
	
	}))



	
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
loadSprite('textcab', 'pz7Zsoz.png')
})