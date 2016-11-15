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
		var price = response.products[0].regularPrice;
		var description = response.products[0].longDescription;
		var image = response.products[0].image;
		

		console.log('name: ' + name);
		console.log('price: ' + price)
		console.log('description ' + description)
		console.log('image: ' + image)

	});

});