$(document).ready(function(){

	slack.start();

	var params = {
		apiKey: 'OQlsKGXtUxeSNIUHxIORzpsG',
		format: 'json'
	};

	var queryURL = 'https://api.bestbuy.com/v1/products((search=Apple)&(categoryPath.id=abcat0501000))?' + $.param(params);

	$.ajax({ 
		url: queryURL, 
		method: 'GET' 
	}).done(function (response){

		var query = response.products;

		//console.log(query);

		for (var i = 0; i < query.length; i++) {

			console.log(query[i].name);
			
		}


	})



	console.log('jquery loaded');

});