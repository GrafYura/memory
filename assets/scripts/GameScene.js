class GameScene extends Phaser.Scene { 
	constructor(param, conf){
		super(param);
		this.defConf = conf;
	}
	preload() {
		this.load.image('bg', '/assets/sprites/background.png');
		this.load.image('card', '/assets/sprites/card.png');
		for(let i = 1;i<=5;i++){
			this.load.image('card'+i, '/assets/sprites/card'+i+'.png');
		}
		
		this.load.audio('card', '/assets/sounds/card.mp3');
		this.load.audio('complete', '/assets/sounds/complete.mp3');
		this.load.audio('success', '/assets/sounds/success.mp3');
		this.load.audio('theme', '/assets/sounds/theme.mp3');
		this.load.audio('timeout', '/assets/sounds/timeout.mp3');
	}
	create() {
		this.createSounds();
		this.createTimer();
		this.createBg();
		this.createText();
		this.createCards();
		this.start();
	}
	restart(){
		let count = 0;
		let onCardMoveComplete = ()=>{
			++count;
			if(count>=this.cards.length)
			this.start();
		}
		this.cards.forEach((card) => {
			card.move({
				x:this.sys.game.config.width+card.width,
				y:this.sys.game.config.height+card.height,
				delay: card.position.delay,
				callback:onCardMoveComplete
			})
		});
	}

	start(){
		this.getCardPositions();
		this.memCard=null;
		this.memCard2=null;
		this.openedCardsCount = 0;
		this.levelTime=this.defConf.levelTime;
		this.timer.paused=false;
		this.initCards();
		this.showCards();
	}
	createSounds(){
		this.sounds={
			card:this.sound.add('card'),
			complete:this.sound.add('complete'),
			success:this.sound.add('success'),
			theme:this.sound.add('theme'),
			timeout:this.sound.add('timeout'),
		};
		this.sounds.theme.play({
			volume:0.1,
			loop:true,
		})
	}

	createTimer(){
		this.timer = this.time.addEvent({
			delay:1000,
			callback:this.onTimerTick,
			callbackScope:this,
			loop:true,
		})
	}
	onTimerTick(){
		this.levelTime--;
		this.timeoutText.setText("Time: " + this.levelTime);
		if(this.levelTime<=0){
			this.sounds.timeout.play();
			this.timer.paused=true;
			this.restart();
		}
	}

	createText(){
		this.timeoutText = this.add.text(10, 330, "Time: " + this.defConf.levelTime, {
			font:'36px CurseCasual',
			fill:'#ffffff',

		});
	}

	initCards() {
		let positions = Phaser.Utils.Array.Shuffle(this.positions);
		this.cards.forEach((card) => {card.init(positions.pop())})
	}
	
	showCards(){
		this.cards.forEach((card) => {
			card.depth = card.position.delay;
			card.move({
				x:card.position.x,
				y:card.position.y,
				delay: card.position.delay
			})
			
		});
	}

	createBg(){
		this.add.sprite(0, 0, 'bg').setOrigin(0, 0);
	}
	createCards(){
		this.cards = [];
		for (let value of this.defConf.cards) {
			this.cards.push(new Card(this,value));
			this.cards.push(new Card(this,value));
		}
		this.input.on("gameobjectdown", this.onCardClicked, this)
	}
	onCardClicked(pointer, card){
		if(card.opened === true || this.memCard && this.memCard2)
		{
			return;
		}
		if (this.memCard){
			this.memCard2=card
			if(this.memCard.value !== this.memCard2.value){				
				setTimeout(()=>{
					this.memCard.close();
					card.close();
					this.memCard=null;
					this.memCard2=null;
				}
				,800)
			}
			else{
				this.sounds.success.play();
				this.openedCardsCount++;
				this.memCard=null;
				this.memCard2=null;
			}
		}
		else{
			this.memCard=card;
		}
		card.open(()=>{
			if(this.openedCardsCount === this.defConf.cards.length){
				this.sounds.complete.play();
				this.restart();
			}	
		});
	}
	getCardPositions() {
		let cardTexture = this.textures.get("card").getSourceImage();
		let height = cardTexture.height + this.defConf.spacing
		let width = cardTexture.width + this.defConf.spacing
		console.log(this.sys.game.config);
		let offsetX = (this.sys.game.config.width - (width *this.defConf.cols + this.defConf.spacing *this.defConf.cols - 1)) / 2 + width/2
		let offsetY = (this.sys.game.config.height - (height *this.defConf.rows + this.defConf.spacing *this.defConf.rows - 1)) / 2 + height/2
		let positions = [];
		for (let row = 0; row <this.defConf.rows; row++)
			for (let col = 0; col <this.defConf.cols; col++) {
				positions.push({
					x: offsetX + col * width,
					y: offsetY + row * height,
					delay:positions.length*150,
				});
			}
		this.positions = positions;
	}
}