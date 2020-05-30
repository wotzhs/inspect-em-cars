import { Pool } from "pg";
const pool = new Pool({
	connectionString: process.env.LOCATION_DB_URL,
});

export default pool;