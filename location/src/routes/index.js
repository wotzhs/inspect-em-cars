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

		callback(null, {"locations": res});
	}
}

export default Routes;