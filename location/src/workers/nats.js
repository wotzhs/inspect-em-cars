import Service from "../services";

class NATSWorker {
	#client;

	constructor(client) {
		this.#client = client;
	}

	init() {
		this.#subscribeAppointment();
	}

	#subscribeAppointment() {
		this.#client.subscribe("appointments.new", async (msg, reply) => {
			const res = await Service.updateAvailability(msg);
			if (res instanceof Error) {
				this.#client.publish(reply, { error: res.message });
			}
			
			this.#client.publish(reply, "ok");
		})
	}
}

export default NATSWorker;