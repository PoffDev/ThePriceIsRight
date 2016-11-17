$(document).ready(function(){

	slack.start();

	//array of products to search between
	var products = ['887276158044', '879957008595', '711719504023', '813646026088', '067638999601', '660685152731', '818279015218', '888462347754', '889296126898', '046677464479', '017817725460', '017817701709', '753759131418'];

	//randomize an item
	var randomProduct = products[Math.floor(Math.random() * products.length)]

	//console.log(randomProduct)

	//pass the randomProduct item into the API
	var queryURL = 'https://api.bestbuy.com/v1/products(upc=' + randomProduct +')?apiKey=OQlsKGXtUxeSNIUHxIORzpsG&format=json';

	$.ajax({ 
		url: queryURL, 
		method: 'GET' 
	}).done(function (response){

		console.log(response)

		var name = response.products[0].name;
		var price = response.products[0].regularPrice + .01;
		var description = response.products[0].longDescription;
		var image = response.products[0].image;
		

		console.log('name: ' + name);
		console.log('price: ' + price)
		console.log('description ' + description)
		console.log('image: ' + image)

		//blank array to store guess
		var guesses = [];
		var correctGuesses = [];
		var winner;

		//4 player guess, push each guess to the array.
		var player1guess = 1;
		var player2guess = 150;
		var player3guess = 340;
		var player4guess = 19998;

		//check if those numbers are not equal
		if (player1guess != player2guess || player3guess || player4guess) {
			guesses.push(player1guess);
		}
		if (player2guess != player1guess || player3guess || player4guess) {
			guesses.push(player2guess);
		}
		if (player3guess != player1guess || player2guess || player4guess) {
			guesses.push(player3guess);
		}
		if (player4guess != player1guess || player2guess || player3guess) {
			guesses.push(player4guess);
		} else {
			console.log('please choose another number');
		}

		//for loop over the array
		for (var i = 0; i < guesses.length; i++) {

			if (guesses[i] === guesses[i]){
				console.log('two numbers are the same')
			}

			//check if guesses in the array is equal to the prize price
			if (guesses[i] === price) {

				console.log('you actually win the prize');

				//celebratory pop up?

			//check if guesses are lower than the prices
			} if (guesses[i] <= price){

				// push lower guesses to correctGuesses array
				correctGuesses.push(guesses[i]);

			//if everyones guesses are too high. 
			} else{

				//restart
				console.log(guesses + ' is too high')

			}

		};


		console.log('correct guesses ' + correctGuesses)

				//find highest number, set to var winner
				var winner = Math.max.apply(Math, correctGuesses);

				//console.log winner
				console.log('winner ' + winner);

				//compare winningGuess to player1, 2, 3, 4 guess
				if (winner == player1guess) {
					console.log('player 1 is the winner');
				}
				if (winner == player2guess) {
					console.log('player 2 is the winner');
				}
				if (winner == player3guess) {
					console.log('player 3 is the winner');
				}
				if (winner == player4guess) {
					console.log('player 4 is the winner');
				}

	});

});