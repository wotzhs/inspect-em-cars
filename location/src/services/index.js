import pool from "../db";

class Service {
	static async fetchInspectionCentres() {
		try {
			const res = await pool.query("SELECT * FROM inspection_centres");
			return res.rows;
		} catch (e) {
			return e;
		}
	}
}

export default Service;