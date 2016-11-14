$(document).ready(function(){

	slack.start();

	var queryURL = 'https://api.bestbuy.com/v1/products((search=Apple)&(categoryPath.id=abcat0501000))?apiKey=OQlsKGXtUxeSNIUHxIORzpsG&format=json';

	$.ajax({ 
		url: queryURL, 
		method: 'GET' 
	}).done(function (response){

		query = response.products;

		//console.log(query);

		for (var i = 0; i < query.length; i++) {

			console.log(query[i].name);
			
		}


	})



	console.log('jquery loaded');

});