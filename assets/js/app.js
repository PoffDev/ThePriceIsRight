$(document).ready(function(){

	slack.start();

	//array of products to search between
	var products = ['iMac', 'Keurig', 'Washer and Dryer', 'Camcorder', 'Camera', 'Sony',];

	//randomize an item
	var randomProduct = products[Math.floor(Math.random() * products.length)]

	//console.log(randomProduct)

	//pass the randomProduct item into the API
	var queryURL = 'https://api.bestbuy.com/v1/products((search='+randomProduct+'))?apiKey=OQlsKGXtUxeSNIUHxIORzpsG&sort=description.asc&format=json';

	$.ajax({ 
		url: queryURL, 
		method: 'GET' 
	}).done(function (response){

		query = response.products;

		console.log(query.name);

		for (var i = 0; i < query.length; i++) {

			var displayItem = query[i].name;

			console.log(displayItem)

		}

		var randomDisplay = displayItem[Math.floor(Math.random() * displayItem.length)]

		console.log('random displayed item' + randomDisplay)


	});

});