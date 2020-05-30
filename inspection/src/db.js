import { Pool } from "pg";
const pool = new Pool({
	connectionString: process.env.INSPECTION_DB_URL,
});

export default pool;