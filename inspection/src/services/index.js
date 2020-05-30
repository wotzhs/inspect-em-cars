import { v4 as uuidV4 } from "uuid";
import pool from "../db";
import { fromProtoDate } from "../../../util/protoDate";

class Service {
	static async createAppointment(appointmentDetails) {
		let { inspection_centre_id, lead_id, date, timeslot } = appointmentDetails;

		// assuming lead_id will be available from another service not within the assessment scope
		if (!lead_id) lead_id = uuidV4();
		let datefmt = fromProtoDate(date);

		try {
			const res = await pool.query(
				`
				INSERT INTO appointments (id, inspection_centre_id, lead_id, date, timeslot)
				VALUES ($1, $2, $3, $4, $5)
				RETURNING id;
				`,
				[ uuidV4(), inspection_centre_id, lead_id, datefmt, timeslot ]

			);
			return res.rows[0];
		} catch(e) {
			return e;
		}
	}
}

export default Service;