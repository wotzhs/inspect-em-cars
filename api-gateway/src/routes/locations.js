import express from "express";
import HttpStatus from "http-status-codes";
import locationService from "../clients/location";
import { toProtoDate } from "../../../util/protoDate";

const router = express.Router();

router.get("/", (req, res, next) => {
	locationService.getLocations({}, (err, resp)=> {
		if (err) {
			console.log(err);
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return res.json({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
		}
		res.json(resp);
	});
});

router.get("/availabilities", (req, res, next) => {
	const { id, start, end } = req.query;

	let startDate;
	if (start) {
		startDate = toProtoDate(start);
	} else {
		let tmpDate = new Date();
		tmpDate.setDate(tmpDate.getDate()+14);
		startDate = toProtoDate(tmpDate);
	}
	let endDate;
	if (end) {
		endDate = toProtoDate(end);
	} else {
		let tmpDate = new Date();
		tmpDate.setDate(tmpDate.getDate()+28);
		endDate = toProtoDate(tmpDate);
	}

	locationService.getLocationAvailabilities({ id, start: startDate, end: endDate }, (err, resp) => {
		if (err) {
			console.log(err);
			res.status(HttpStatus.BAD_REQUEST);
			return res.json({ error: err.message });
		}
		res.json(resp);
	});
});

export default router;
