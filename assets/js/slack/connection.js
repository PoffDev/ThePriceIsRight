var connection = {
	ws: undefined,
	start: function(url, callback) {
		this.ws = new WebSocket(url);

		this.ws.onmessage = function(event) {
			if (event.type !== 'message') return;
			callback(JSON.parse(event.data));
		}
	},
	send: function(message) {
		this.ws.send(message);
	}
};
