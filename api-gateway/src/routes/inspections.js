import express from "express";
import inspectionService from "../clients/inspection";

const router = express.Router();

router.get("/", (req, res, next) => {
	inspectionService.getAvailabilities({}, (err, resp)=> {
		let availabilities = resp.availabilities.map(availability => {
			const { date, slots } = availability;
			let datefmt = new Date(date.seconds*1000 + date.nanos/1000).toISOString();
			return { date: datefmt, slots };
		});

		res.json({ availabilities });
	});
});

export default router;
