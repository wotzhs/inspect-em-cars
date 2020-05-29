class indexRoutes {
	static getLocations(call, callback) {
		callback(null, {"locations": [{"name": "hello world"}]});
	}
}

export default indexRoutes;