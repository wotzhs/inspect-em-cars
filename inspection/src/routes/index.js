class indexRoutes {
	static getAvailabilities(call, callback) {
		let now = Date.now();
		callback(
			null, 
			{ 
				"availabilities": [
					{ 
						"date": {
							seconds: Math.floor(now/1000), 
							nanos: (now%1000)*1000,
						},
						slots: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
					}
				]
			}
		);
	}
}

export default indexRoutes;