import { v4 as uuidV4 } from "uuid";
import { NatsError, REQ_TIMEOUT } from "nats";
import differenceInDays from "date-fns/differenceInDays";
import getDay from "date-fns/getDay";
import pool from "../db";
import { fromProtoDate } from "../../../util/protoDate";
import locationService from "../../clients/location";
import nc from "../../clients/nats";

class Service {
	static async createAppointment(appointmentDetails) {
		let { inspection_centre_id, lead_id, date, timeslot } = appointmentDetails;

		// assuming lead_id will be available from another service not within the assessment scope
		if (!lead_id) lead_id = uuidV4();
		let dateObj = fromProtoDate(date);

		if (getDay(dateObj) == 0) {
			return Error("appointments can only be created from monday to saturday");
		}

		if (differenceInDays(dateObj, new Date() < 14)) {
			return Error("appointments can only be created at least 14 days in advance");
		}

		try {
			// check availability before trying to create appointment;
			await new Promise((resolve, reject)=>{
				const payload = { id: inspection_centre_id, start: date, end: date };
				locationService.getLocationAvailabilities(payload, async (err, resp) => {
					if (err) {
						reject(err);
					}

					if (resp.availabilities[0].slots[timeslot -1] < 1) {
						reject(new Error("selected slot is unavailable"));
					}
					resolve();
				}) ;
			});

			// create appointment
			await pool.query("BEGIN");
			const res = await pool.query(
				`
				INSERT INTO appointments (id, inspection_centre_id, lead_id, date, timeslot)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id;
				`,
				[ uuidV4(), inspection_centre_id, lead_id, dateObj.toISOString(), timeslot ]

			);

			// update availability count through nats server, rollback if count falls below 0
			await new Promise((resolve, reject) => {
				nc.request(
					"appointments.new",
					{ inspection_centre_id, date, slot: timeslot },
					{ max: 1, timeout: 3000 },
					msg => {
						if (msg instanceof NatsError && msg.code === REQ_TIMEOUT) {
							reject(new Error("operation timed out"));
						}

						if (msg.name === "error") {
							reject(new Error("selected slot is unavailable"));
						}

						if (msg.error) {
							reject(new Error(msg.error));
						}

						resolve();
					}
				);
			});

			await pool.query("COMMIT");
			return res.rows[0];
		} catch(e) {
			await pool.query("ROLLBACK");
			return e;
		}
	}
}

export default Service;