let lastCard = 51;
let ace = 0;
let moves = 0;
let cardsDealt = 0;
let seconds = 0;
let handsPlayed = 0;
let handsWon = 0;
let dropArray = [];
let timer;
let newCardBlock;
let newCardFlipBlock;

function clearGlobal(){
	clearInterval(timer);
	lastCard = 51;
	ace = 0;
	moves = 0;
	cardsDealt = 0;
	seconds = 0;
	dropArray = [];
}
document.addEventListener('keydown', function(event) {
	if (event.code == 'KeyD') {
		gameStart();
	}
});

let container = document.createElement('div');
container.id = 'container';
document.body.prepend(container);

let gameArea = document.createElement('div');
gameArea.id = 'gameArea';
container.append(gameArea);

let scoreArea = document.createElement('div');
scoreArea.id = 'scoreArea';
container.append(scoreArea);

let scoreBlockTime = document.createElement('div');
scoreBlockTime.className = 'scoreBlock';
scoreArea.append(scoreBlockTime);

let scoreValueTime = document.createElement('span');
scoreValueTime.className = 'scoreValue';
scoreValueTime.innerText = '0:00';
scoreBlockTime.append(scoreValueTime);

let scoreBlockMoves = document.createElement('div');
scoreBlockMoves.className = 'scoreBlock';
scoreArea.append(scoreBlockMoves);

let scoreValueMoves = document.createElement('span');
scoreValueMoves.className = 'scoreValue';
scoreValueMoves.innerText = moves + ' moves';
scoreBlockMoves.append(scoreValueMoves);

gameStart();

function newCard(){
	dealCards(0, newCardFlipBlock);
	increaseMoves();
}

function gameStart(){
	clearGlobal();
	shuffleCards(1, cards);
	handsPlayed++;
	gameArea.innerHTML = '';

	let gameAreaSpan = document.createElement('span');
	gameAreaSpan.id = 'gameAreaSpan';
	gameAreaSpan.innerText = 'Press D to deal again';
	gameArea.append(gameAreaSpan);

	for(let i = 0; i < 7; i++){
		let playBlock = document.createElement('div');
		playBlock.className = 'cardBlock';
		gameArea.append(playBlock);

		dealCards(4, playBlock);
	}

	let divider = document.createElement('div');
	divider.className = 'divider';
	gameArea.append(divider);
	
	newCardBlock = document.createElement('div');
	newCardBlock.className = 'cardBlockNewClick cardHidden';
	gameArea.append(newCardBlock);

	newCardFlipBlock = document.createElement('div');
	newCardFlipBlock.className = 'cardBlock';
	newCardFlipBlock.addEventListener('drop', function(){
		drop(event);
	});
	newCardFlipBlock.addEventListener('dragover', function(){
		allowDrop(event);
	});
	gameArea.append(newCardFlipBlock);

	dealCards(0, newCardFlipBlock);

	newCardBlock.addEventListener('click', newCard);

	let blankBlock = document.createElement('div');
	blankBlock.className = 'blankBlock';
	gameArea.append(blankBlock);

	scoreValueTime.innerText = '0:00';
	scoreValueMoves.innerText = moves + ' moves';
}

function displayModel(){
	let shadowBack = document.createElement('div');
	shadowBack.id = 'shadowBack';
	gameArea.append(shadowBack);

	let model = document.createElement('div');
	model.id = 'model';
	shadowBack.append(model);

	let modelConent = document.createElement('div');
	modelConent.id = 'modelConent';
	model.append(modelConent);

	let modelSpan = document.createElement('span');
	modelSpan.id = 'modelSpan';
	modelSpan.innerText = 'Congratulations, you won!';
	modelConent.append(modelSpan);

	let modelScoreBlock = document.createElement('div');
	modelScoreBlock.id = 'modelScoreBlock';
	modelConent.append(modelScoreBlock);

	let playedSpan = document.createElement('span');
	playedSpan.className = 'scoreSpan';
	playedSpan.innerText = 'Hands played: ' + handsPlayed;
	modelScoreBlock.append(playedSpan);

	let wonSpan = document.createElement('span');
	wonSpan.className = 'scoreSpan';
	wonSpan.innerText = 'Hands won: ' + handsWon;
	modelScoreBlock.append(wonSpan);

	let modelBtn = document.createElement('btn');
	modelBtn.id = 'modelBtn';
	modelBtn.innerText = 'Play again';
	modelBtn.addEventListener('click', function(){
		fadeOut(shadowBack, 500);
		setTimeout(function(){
			gameStart();
		}, 200);
	});
	modelConent.append(modelBtn);
	setTimeout(function(){
		shadowBack.style.cssText = 'opacity:1';
	}, 1);
}

function fadeIn(el, time){
	el.style.cssText = 'opacity:1';
	setTimeout(function(){
		el.removeAttribute('style');
	}, time);
}

function fadeOut(el, time){
	el.style.cssText = 'opacity:0;';
	setTimeout(function(){
		el.innerHTML = '';
	}, time);
}

function allowDrop(ev) {
	ev.preventDefault();
}

function drag(ev) {
	dropArray = [];
	ev.dataTransfer.setData("card", ev.target.id);
}

function drop(ev) {
	let data = ev.dataTransfer.getData("card");
	let element = document.getElementById(data);
	let parent = element.closest('.cardBlock');
	let face = element.getAttribute('data-face');

	let cardBlockParent = ev.target.closest('.cardBlock');
	let cardsEl = cardBlockParent.getElementsByClassName('card');

	let currentFacePos = cardPosition(face, 0) + 1;
	let dropFacePos = cardPosition(cardsEl[cardsEl.length - 1].getAttribute('data-face'), 0);
	if(currentFacePos == dropFacePos || currentFacePos == dropFacePos + 2){
		element.setAttribute('temp', true);
		element.className = 'card topClassDrop';
		cardBlockParent.append(element);

		if(parent != null){
			let cardCount = parent.getElementsByClassName('card');
			if(cardCount.length > 0){
				cardCount[cardCount.length - 1].classList.remove('cardHidden');
				cardCount[cardCount.length - 1].setAttribute('draggable', true);
			}
		}
	}

	ev.preventDefault();

	increaseMoves();
	checkWin(cardBlockParent);
}

function checkWin(cardBlockParent){
	let card = cardBlockParent.getElementsByClassName('card');
	if(card.length == 52){
		return gameWin(cardBlockParent);
	}
}

function gameWin(cardBlockParent){
	clearInterval(timer);
	handsWon++;

	let card = cardBlockParent.getElementsByClassName('card');
	for(let i = 0; i < card.length; i++){
		let counter = 125 * i;
		let maxTime = 125 * card.length + 125;
		setTimeout(function(){
			card[i].style.cssText = 'left: 518px;';
		}, counter);
		setTimeout(function(){
			card[i].removeAttribute('style');
		}, maxTime);
	}
	
	setTimeout(function(){
		displayModel();
	}, 7000);
}

function increaseMoves(){
	moves++;
	document.getElementsByClassName('scoreValue')[1].innerText = moves + ' moves';
	if(moves == 1){
		startTimer();
	}
}

function timerConvert(ms) {
	let minutes = Math.floor(ms / 60000);
	let seconds = ((ms % 60000) / 1000).toFixed(0);
	return (seconds == 60)? (minutes + 1) + ':00' : minutes + ':' + ((seconds < 10)? '0' : '') + seconds;
}

function startTimer(){
	timer = setInterval(function() {
		seconds = seconds + 1000;
		document.getElementsByClassName('scoreValue')[0].innerText = timerConvert(seconds);
	}, 1000);
}

function dealCards(count, playBlock){
	for(let i = 1; i <= (count + 1); i++){
		let colourClass = (cards[cardsDealt].suit == 'heart' || cards[cardsDealt].suit == 'diamond')? ' red' : ' black';
		let topClass = (i > 1)? ' topClass' + i : '';
		let card = document.createElement('div');
		card.className = 'card' + topClass;
		card.id = cards[cardsDealt].suit + cards[cardsDealt].face;
		card.setAttribute('data-id', cardsDealt);
		card.setAttribute('data-face', cards[cardsDealt].face);
		card.setAttribute('data-suit', cards[cardsDealt].suit);
		if(cardsDealt > 34){
			card.setAttribute('draggable', true);
			card.setAttribute('deal-card', true);
		}
		card.addEventListener('dragstart', function(){
			drag(event);
		});
		playBlock.append(card);

		let numberTop = document.createElement('div');
		numberTop.className = 'number-top' + colourClass;
		numberTop.innerText = cards[cardsDealt].face;
		card.append(numberTop);

		let suitTop = document.createElement('div');
		suitTop.className = 'suit-top';
		card.append(suitTop);

		let suitTopEl = document.createElement('div');
		suitTopEl.className = cards[cardsDealt].suit;
		suitTop.append(suitTopEl);

		let suitCentre = document.createElement('div');
		suitCentre.className = 'suit-centre';
		card.append(suitCentre);

		if(cards[cardsDealt].face != 'J' && cards[cardsDealt].face != 'Q' && cards[cardsDealt].face != 'K' && cards[cardsDealt].face != 'A'){
			for(let k = 0; k < parseInt(cards[cardsDealt].face); k++){
				let suitEl = document.createElement('div');
				suitEl.className = cards[cardsDealt].suit + ' ' + cards[cardsDealt].suitClass + '-' + suitCentreClasses[k];
				suitCentre.append(suitEl);
			}
		}else{
			let suitEl = document.createElement('div');
			suitEl.className = cards[cardsDealt].suitClass + ' ' + cards[cardsDealt].suitCentreClass;
			suitEl.innerText = cards[cardsDealt].face;
			suitCentre.append(suitEl);
		}

		let numberBottom = document.createElement('div');
		numberBottom.className = 'number-bottom';
		numberBottom.innerText = cards[cardsDealt].face;
		card.append(numberBottom);

		let suitBottom = document.createElement('div');
		suitBottom.className = 'suit-bottom';
		card.append(suitBottom);

		let suitBottomEl = document.createElement('div');
		suitBottomEl.className = cards[cardsDealt].suit;
		suitBottom.append(suitBottomEl);

		cardsDealt++;
		if(cardsDealt == 35){
			let cardBlocks = document.getElementsByClassName('cardBlock');
			for(let i = 0; i < cardBlocks.length; i++){
				let cardsEl = cardBlocks[i].getElementsByClassName('card');
				cardsEl[cardsEl.length - 1].classList.remove('cardHidden');
				cardsEl[cardsEl.length - 1].setAttribute('draggable', true);
			}
		}

		if(cardsDealt >= cards.length){
			newCardBlock.className = 'cardBlockNewClick';
			let span = document.createElement('span');
			span.className = 'ncbSpan';
			span.innerText = '0';
			newCardBlock.append(span);
			newCardBlock.removeEventListener('click', newCard);
		}
	}
}
