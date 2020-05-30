import express from "express";
import HttpStatus from "http-status-codes";
import inspectionService from "../clients/inspection";
import { toProtoDate } from "../../../util/protoDate";

const router = express.Router();

router.post("/", (req, res, next) => {
	const { date, ...others } = req.body;
	let protoDate = toProtoDate(date);
	inspectionService.createAppointment({ ...others, date: protoDate }, (err, resp)=> {
		if (err) {
			console.log(err);
			res.status(HttpStatus.INTERNAL_SERVER_ERROR);
			return res.json({ error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR) });
		}

		res.json(resp);
	});
});

export default router;
