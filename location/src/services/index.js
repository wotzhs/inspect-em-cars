import differenceInDays from "date-fns/differenceInDays";
import addDays from "date-fns/addDays";
import isEqual from "date-fns/isEqual";
import getDay from "date-fns/getDay";
import format from "pg-format";
import pool from "../db";
import { fromProtoDate, toProtoDate } from "../../../util/protoDate";

const weekdaysSlot = [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2];
const saturdaySlot = [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4];

class Service {
	static async fetchInspectionCentres() {
		try {
			const res = await pool.query("SELECT * FROM inspection_centres");
			return res.rows;
		} catch (e) {
			return e;
		}
	}

	static async insertAvailabilities(dates, inspection_centre_id) {
		let values = dates.map(date=> {
			const slots = getDay(Date.parse(date)) == 6 ? saturdaySlot : weekdaysSlot;
			const slotsStr = `{${slots.toString()}}`;
			return [ inspection_centre_id, date, slotsStr];
		});

		try {
			const res = await pool.query(format(
				`
				INSERT INTO availabilities (inspection_centre_id, date, slots)
				VALUES %L
				RETURNING *;
				`,
				values
			));
			return res.rows;
		} catch (e) {
			return e;
		}
	}

	static async getAvailabilitiesByLocation({ id, start, end }) {
		let startDate = fromProtoDate(start);
		let endDate = fromProtoDate(end);
		let diff = differenceInDays(endDate, startDate)+1;

		if (diff > 14) {
			return Error("maximum date range is 14 days");
		}

		let datesToInsert = [];
		for (let i=0; i<diff; i++) {
			let date = addDays(startDate, i);

			// sunday is 0
			if (getDay(date)) {
				datesToInsert.push(date.toISOString());
			}
		}

		try {
			const res = await pool.query(
				`
				SELECT * FROM availabilities 
				WHERE inspection_centre_id = $1 AND date >= $2 AND date <= $3
				ORDER BY date;
				`,
				[id, startDate.toISOString(), endDate.toISOString()]
			);

			for (let i=0; i<res.rows.length; i++) {
				let idx = datesToInsert.indexOf(res.rows[i].date);
				if (idx >= 0){
					datesToInsert[idx] = datesToInsert[datesToInsert.length-1];
					datesToInsert.pop();
				}
			}

			if (datesToInsert.length) {
				const newAvailabilities = await this.insertAvailabilities(datesToInsert, id);
				if (newAvailabilities instanceof Error) {
					throw new Error("failed to insert new availabilities", newAvailabilities);
				}

				res.rows = res.rows.concat(newAvailabilities);
			}

			let availabilities = res.rows.map(row=> {
				const { date, ...others } = row;
				let protoDate = toProtoDate(date);
				return { date: protoDate, ...others };
			});

			return availabilities;
		} catch(e) {
			return e;
		}
	}
}

export default Service;