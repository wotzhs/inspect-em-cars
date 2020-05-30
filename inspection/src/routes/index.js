import grpc from "grpc";
import Service from "../services";

class Routes {
	static async createAppointment(call, callback) {
		const res = await Service.createAppointment(call.request);
		if (res instanceof Error) {
			console.log(res);
			return callback({
				code: grpc.status.INTERNAL,
				details: "internal server error",
			});
		}

		callback(null, res);
	}
}

export default Routes;