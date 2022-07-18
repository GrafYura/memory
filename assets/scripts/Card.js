class Card extends Phaser.GameObjects.Sprite{
	constructor(scene, value){
		super(scene, 0, 0, 'card');
		this.scene = scene;
		this.value = value;
		this.opened=false;
		this.scene.add.existing(this);
		this.animDuration = 150;

		this.setInteractive();
	}
	flip(callback){
		this.scene.sounds.card.play();
		this.scene.tweens.add({
			targets: this,
			scaleX: 0,
			ease: 'Linear',
			duration:this.animDuration,
			onComplete: ()=>{
				this.setTexture('card'+(this.opened?this.value:''));
				this.show(callback);
			}
		});
	}
	show(callback){
		this.scene.tweens.add({
			targets: this,
			scaleX: 1,
			ease: 'Linear',
			duration:this.animDuration,
			onComplete:()=>{
				if(callback)
					callback();
			}
		});
	}
	open(callback){
		this.opened=true;
		this.flip(callback);
	}
	close(){
		if(this.opened===false)
			return;
		this.opened=false;
		this.flip();
	}

	init(position){
			this.position = position;
			this.close();
			this.setPosition(-this.width, -this.height);
		}

	move(params){
		this.scene.tweens.add({
			targets: this,
			x: params.x,
			y: params.y,
			delay: params.delay,
			ease: 'Linear',
			duration:this.animDuration*2,
			onComplete: ()=>{
				if(params.callback)
					params.callback();
			}
		})
		}
}
