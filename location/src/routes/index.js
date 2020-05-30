import grpc from "grpc";
import Service from "../services";

class Routes {
	static async getLocations(call, callback) {
		const res = await Service.fetchInspectionCentres();
		if (res instanceof Error) {
			console.log(res);
			return callback({
				code: grpc.status.INTERNAL,
				details: "internal server error",
			});
		}

		callback(null, { "locations": res });
	}

	static async getLocationAvailabilities(call, callback) {
		const res = await Service.getAvailabilitiesByLocation(call.request);
		if (res instanceof Error) {
			let code = grpc.status.INTERNAL;
			let details = "internal server error";

			if (res.message == "maximum date range is 14 days") {
				code = grpc.status.OUT_OF_RANGE;
				details = res.message;
			}

			return callback({ code, details });
		}

		callback(null, { "availabilities": res });
	}
}

export default Routes;